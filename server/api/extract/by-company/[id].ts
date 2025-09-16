// server/api/extract/by-company/[id].ts
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id
  const companyIdNum = Number(idParam)
  if (!companyIdNum || Number.isNaN(companyIdNum)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid company id' })
  }

  const companyIdBig = BigInt(companyIdNum)

  const sites = await prisma.sites.findMany({
    where: { company_id: companyIdBig },
    select: { site_id: true },
  })

  if (sites.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'No sites found for this company' })
  }

  const siteIdSet = new Set(sites.map(s => s.site_id.toString()))

  const extracts = await prisma.extract_content.findMany({
    orderBy: { created_at: 'desc' },
    take: 200,
  })

  const matched = extracts.find((e) => {
    const rc = e.raw_content as Prisma.JsonObject | null
    if (!rc) return false
    const siteIdInJson = rc.siteId != null ? String(rc.siteId) : ''
    return siteIdSet.has(siteIdInJson)
  })

  if (!matched) {
    throw createError({ statusCode: 404, statusMessage: 'No extract content found for this company' })
  }

  // Return the simplified JSON we saved earlier
  return matched.raw_content
})
