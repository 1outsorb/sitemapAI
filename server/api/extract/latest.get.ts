// server/api/extract/latest.get.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  try {
    const latest = await prisma.extract_content.findFirst({
      orderBy: { created_at: 'desc' },
      include: { files: true }
    })

    if (!latest) {
      return null
    }

    return {
      result: {
        id: latest.id.toString(),
        fileId: latest.file_id.toString(),
        created_at: latest.created_at,
        file_name: latest.files?.file_name || null,
        ...latest.raw_content  
      }
    }
  } catch (err) {
    console.error('Error fetching latest extract_content:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch latest extract_content'
    })
  }
})
