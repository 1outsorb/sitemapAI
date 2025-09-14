import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";




export async function analyzeDocumentWithCustomModel(buffer: Buffer) {
  const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT!;
  const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY!;
  const modelId = process.env.AZURE_DOCUMENT_INTELLIGENCE_MODEL!;

  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
  const poller = await client.beginAnalyzeDocument(modelId, buffer);
  const result = await poller.pollUntilDone();
  return result;
}
