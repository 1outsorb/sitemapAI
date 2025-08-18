//to run the test:    npx tsx test-db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1) READ: list all companies
  const companies = await prisma.company.findMany()
  console.log('Existing companies:', companies)

  // 2) CREATE: insert a new company
  const created = await prisma.company.create({
    data: {
      company_name: `Test Company ${new Date().toISOString()}`, // keep values in English
      company_address: 'Sydney, Australia',
    },
  })
  console.log('Created company:', created)

  // 3) UPDATE: update that company’s address
  const updated = await prisma.company.update({
    where: { company_id: created.company_id },
    data: { company_address: 'Melbourne, Australia' },
  })
  console.log('Updated company:', updated)

  // 4) READ (single): fetch the company by its primary key
  const fetched = await prisma.company.findUnique({
    where: { company_id: updated.company_id },
  })
  console.log('Fetched company by ID:', fetched)

  // 5) OPTIONAL: UPSERT example (update if exists, else create)
  const upserted = await prisma.company.upsert({
    where: { company_id: 999999 }, // a key that likely doesn't exist
    update: { company_address: 'Perth, Australia' },
    create: {
      company_name: 'Upserted Company',
      company_address: 'Brisbane, Australia',
    },
  })
  console.log('Upserted company (create or update):', upserted)

  // 6) OPTIONAL: a small transaction example
  const [txA, txB] = await prisma.$transaction([
    prisma.company.create({
      data: { company_name: 'TX Company A', company_address: 'Adelaide, Australia' },
    }),
    prisma.company.create({
      data: { company_name: 'TX Company B', company_address: 'Canberra, Australia' },
    }),
  ])
  console.log('Transaction created companies:', txA, txB)

  // 7) CLEANUP: delete the record we created first
  const deleted = await prisma.company.delete({
    where: { company_id: created.company_id },
  })
  console.log('Deleted initial created company:', deleted)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error in test-db.ts:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
