import { readFormData } from "h3";
import { createError } from "h3";
import { DefaultAzureCredential } from "@azure/identity";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { createReadStream } from "node:fs";

export default defineEventHandler(async (event) => {
  const endpoint =
    process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT ||
    process.env.AZURE_DI_ENDPOINT;
  const key =
    process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY || process.env.AZURE_DI_KEY;
  const modelId =
    process.env.AZURE_DOCUMENT_INTELLIGENCE_MODEL ||
    process.env.AZURE_DI_MODEL_ID ||
    "prebuilt-layout";

  if (!endpoint || !key || !modelId) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing Azure env vars",
    });
  }

  const form = await readFormData(event);
  const file = form.get("file");
  if (!file || typeof file === "string") {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }

  const arrayBuf = await file.arrayBuffer();
  const body = Buffer.from(arrayBuf);

  const baseEP = endpoint.replace(/\/$/, "");
  const apiVersion = "2024-11-30";

  const url = `${baseEP}/documentintelligence/documentModels/${encodeURIComponent(
    modelId
  )}:analyze?api-version=${apiVersion}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/octet-stream",
    },
    body,
  });

  if (res.status !== 202) {
    const text = await res.text().catch(() => "");
    throw createError({
      statusCode: res.status,
      statusMessage: `Azure rejected request: ${res.statusText}`,
      data: text,
    });
  }

  const opLocation = res.headers.get("operation-location");
  if (!opLocation) {
    throw createError({
      statusCode: 500,
      statusMessage: `Missing operation-location in response`,
    });
  }

  const poll = async () => {
    const r = await fetch(opLocation, {
      headers: { "Ocp-Apim-Subscription-Key": key },
    });
    const text = await r.text();
    if (!r.ok) {
      throw createError({
        statusCode: r.status,
        statusMessage: text || "Polling failed",
      });
    }
    try {
      return JSON.parse(text);
    } catch {
      throw createError({
        statusCode: 500,
        statusMessage: "Invalid JSON from polling",
      });
    }
  };

  const start = Date.now();
  let data: any;
  while (true) {
    data = await poll();
    const status = data?.status;
    if (status === "succeeded") break;
    if (status === "failed" || status === "partiallySucceeded") {
      throw createError({
        statusCode: 500,
        statusMessage: `LRO failed: ${JSON.stringify(data)}`,
      });
    }
    if (Date.now() - start > 120000) {
      throw createError({ statusCode: 504, statusMessage: "Polling timeout" });
    }
    await new Promise((r) => setTimeout(r, 1500));
  }




  // NEW CODE
    const credential = new DefaultAzureCredential();
  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(key)
  );

  const path = "./test.pdf";
  const readStream = createReadStream(path);
  
    const poller = await client.beginAnalyzeDocument(modelId, body, {
    onProgress: ({ status }) => {
      console.log(`status: ${status}`);
    },
  });

  // There are more fields than just these three
  const { documents, pages, tables } = await poller.pollUntilDone();

  console.log("Documents:");
  for (const document of documents || []) {
    console.log(`Type: ${document.docType}`);
    console.log("Fields:");
    for (const [name, field] of Object.entries(document.fields)) {
      console.log(
        `Field ${name} has content '${field.content}' with a confidence score of ${field.confidence}`
      );
    }
  }

  console.log("Pages:");
  for (const page of pages || []) {
    console.log(
      `Page number: ${page.pageNumber} (${page.width}x${page.height} ${page.unit})`
    );
  }

  console.log("Tables:");
  for (const table of tables || []) {
    console.log(`- Table (${table.columnCount}x${table.rowCount})`);
    for (const cell of table.cells) {
      console.log(
        `  - cell (${cell.rowIndex},${cell.columnIndex}) "${cell.content}"`
      );
    }
  }





  return {
    modelId,
    status: data.status,
    content: JSON.stringify(data, null, 2),
    documents: documents,
    pages: pages,
    tables: tables
  };
});
