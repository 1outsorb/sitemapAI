import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const result = await prisma.$queryRaw<
    { month: string; count: bigint }[]
  >`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', uploaded_at), 'YYYY-MM') AS month,
      COUNT(DISTINCT file_id) AS count
    FROM files
    GROUP BY DATE_TRUNC('month', uploaded_at)
    ORDER BY month;
  `

  return result.map((r) => ({
    month: r.month,
    count: Number(r.count),
  }))
})
