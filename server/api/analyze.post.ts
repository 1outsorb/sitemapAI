import { readFormData } from 'h3'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const endpoint =
    process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT ||
    process.env.AZURE_DI_ENDPOINT
  const key =
    process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY ||
    process.env.AZURE_DI_KEY
  const modelId =
    process.env.AZURE_DOCUMENT_INTELLIGENCE_MODEL ||
    process.env.AZURE_DI_MODEL_ID ||
    'prebuilt-layout' 

  if (!endpoint || !key || !modelId) {
    throw createError({ statusCode: 500, statusMessage: 'Missing Azure env vars' })
  }

  const form = await readFormData(event)
  const file = form.get('file')
  if (!file || typeof file === 'string') {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const arrayBuf = await file.arrayBuffer()
  const body = Buffer.from(arrayBuf)

  const baseEP = endpoint.replace(/\/$/, '')
  const apiVersion = '2024-11-30' 

  const url = `${baseEP}/formrecognizer/documentModels/${encodeURIComponent(modelId)}:analyze?api-version=${apiVersion}`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/octet-stream',
    },
    body,
  })

  if (res.status !== 202) {
    const text = await res.text().catch(() => '')
    throw createError({
      statusCode: res.status,
      statusMessage: `Azure rejected request: ${res.statusText}`,
      data: text,
    })
  }

  const opLocation = res.headers.get('operation-location')
  if (!opLocation) {
    throw createError({ statusCode: 500, statusMessage: `Missing operation-location in response` })
  }

  const poll = async () => {
    const r = await fetch(opLocation, {
      headers: { 'Ocp-Apim-Subscription-Key': key },
    })
    const text = await r.text()
    if (!r.ok) {
      throw createError({ statusCode: r.status, statusMessage: text || 'Polling failed' })
    }
    try {
      return JSON.parse(text)
    } catch {
      throw createError({ statusCode: 500, statusMessage: 'Invalid JSON from polling' })
    }
  }

  const start = Date.now()
  let data: any
  while (true) {
    data = await poll()
    const status = data?.status
    if (status === 'succeeded') break
    if (status === 'failed' || status === 'partiallySucceeded') {
      throw createError({ statusCode: 500, statusMessage: `LRO failed: ${JSON.stringify(data)}` })
    }
    if (Date.now() - start > 120000) {
      throw createError({ statusCode: 504, statusMessage: 'Polling timeout' })
    }
    await new Promise(r => setTimeout(r, 1500))
  }

  return {
    modelId,
    status: data.status,
    content: JSON.stringify(data, null, 2),
  }
})

