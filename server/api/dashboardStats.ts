import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const totalClients = await prisma.company.count()
  const totalSites = await prisma.sites.count()
  const totalAllocations = await prisma.area_tasks.count()
  const pending = await prisma.schedules.count({
    where: { effective_from: null }, 
  })

  return {
    totalClients: Number(totalClients),
    totalSites: Number(totalSites),
    totalAllocations: Number(totalAllocations),
    pending: Number(pending),
  }
})
