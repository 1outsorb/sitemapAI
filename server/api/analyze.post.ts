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




  // NEW CODE
    const credential = new DefaultAzureCredential();
  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(key)
  );

    const form = await readFormData(event);
  const file = form.get("file");
  if (!file || typeof file === "string") {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }

  const arrayBuf = await file.arrayBuffer();
  const body = Buffer.from(arrayBuf);

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
    documents: documents,
    pages: pages,
    tables: tables
  };
});
