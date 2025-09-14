import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        sites: {
          include: {
            area_tasks: true,
          },
        },
      },
    })

    return companies.map((c) => ({
  id: Number(c.company_id),         
  clientName: c.company_name,
  address: c.company_address,
  numLocations: Number(c.sites.length),
  numTasks: Number(
    c.sites.reduce((sum, site) => sum + site.area_tasks.length, 0)
  ),
}))

  } catch (err) {
    console.error('Error loading clients:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load clients',
    })
  }
})
