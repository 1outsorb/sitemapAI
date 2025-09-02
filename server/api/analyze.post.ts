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

  const poller = await client.beginAnalyzeDocument(modelId, body, {
    onProgress: ({ status }) => {
      console.log(`status: ${status}`);
    },
  });

  // There are more fields than just these three
  const { documents, pages, tables } = await poller.pollUntilDone();

  return {
    modelId,
    documents: documents,
    pages: pages,
    tables: tables,
  };
});
