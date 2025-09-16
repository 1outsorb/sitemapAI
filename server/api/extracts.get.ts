import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const extracts = await prisma.extract_content.findMany({
    orderBy: { created_at: 'desc' },
    include: { files: true },
  })

  return extracts.map(e => ({
    id: e.id,
    fileName: e.files.file_name,
    createdAt: e.created_at,
    raw: e.raw_content,
  }))
})
