import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer"

// default model
export async function analyzeDocumentWithCustomModel(buffer: Buffer) {
  const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT!
  const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY!
  const modelId = process.env.AZURE_DOCUMENT_INTELLIGENCE_MODEL!

  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key))
  const poller = await client.beginAnalyzeDocument(modelId, buffer)
  return await poller.pollUntilDone()
}

// alt model
export async function analyzeDocumentWithAltModel(buffer: Buffer) {
  const endpoint = process.env.AZURE_DOCUMENT_ALT_ENDPOINT
  const key = process.env.AZURE_DOCUMENT_ALT_KEY
  const modelId = process.env.AZURE_DOCUMENT_ALT_MODEL

  if (!endpoint || !key || !modelId) {
    throw new Error("[Azure] Alt model config missing. Please set AZURE_DOCUMENT_ALT_ENDPOINT, AZURE_DOCUMENT_ALT_KEY, AZURE_DOCUMENT_ALT_MODEL in .env")
  }

  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key))
  const poller = await client.beginAnalyzeDocument(modelId, buffer)
  return await poller.pollUntilDone()
}

