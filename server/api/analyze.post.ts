import { PrismaClient } from '@prisma/client'
import { IncomingForm } from 'formidable'
import fs from 'fs/promises'
import { analyzeDocumentWithCustomModel } from '~/server/azure'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const form = new IncomingForm()

  // Parse uploaded file
  const data = await new Promise<{ file: any }>((resolve, reject) => {
    form.parse(event.req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ file: files.file[0] })
    })
  })

  const file = data.file
  const buffer = await fs.readFile(file.filepath)

  // Calculate SHA-256 hash
  const sha256 = createHash('sha256').update(buffer).digest('hex')

  // Call Azure document analysis
  const result = await analyzeDocumentWithCustomModel(buffer)

  // Extract fields from Azure result
  const fields = result?.documents?.[0]?.fields || {}

  console.log('Extracted field values (summary):', {
    CompanyName: fields.CompanyName?.content,
    Address: fields.Address?.content,
    Area: fields.Area?.content,
    Tasks: fields.Tasks?.content,
    Frequency: fields.Frequency?.content,
    EffectiveFrom: fields.EffectiveFrom?.content,
  })

  const companyName = fields.CompanyName?.content ?? 'Unknown Company'
  const address = fields.Address?.content ?? 'Unknown Address'
  const siteName = fields.Area?.content ?? 'UnKnown Site'
  const taskName = fields.Tasks?.content ?? 'Unknown Task'
  const frequency = fields.Frequency?.content?.toUpperCase() ?? 'Unknown Frequency'
  const effectiveFromRaw = fields.EffectiveFrom?.content

  const validRules = ['WEEKLY', 'MONTHLY', 'ONE_OFF']
  const scheduleRule = validRules.includes(frequency) ? frequency : 'ONE_OFF'

  let effectiveFrom: Date | null = null
  if (effectiveFromRaw) {
    try {
      effectiveFrom = new Date(effectiveFromRaw)
    } catch (err) {
      console.warn('Date parsing failed:', effectiveFromRaw)
    }
  }

  // Check for duplicate file by hash
  let fileRecord = await prisma.files.findUnique({
    where: { sha256: sha256 }
  })

  if (!fileRecord) {
    fileRecord = await prisma.files.create({
      data: {
        file_name: file.originalFilename,
        file_size: file.size,
        file_type: file.mimetype,
        sha256: sha256,
      }
    })
  }

  // Insert or find company
 const company = await prisma.company.create({
  data: {
    company_name: companyName,
    company_address: address,
  },
})


  // Insert site
  const site = await prisma.sites.create({
    data: {
      company_id: company.company_id,
      site_name: siteName,
    }
  })

  // Insert or find task
  let task = await prisma.tasks.findFirst({
    where: { task_name: taskName }
  })

  if (!task) {
    task = await prisma.tasks.create({
      data: { task_name: taskName }
    })
  }

  // Insert area_task relationship
  const areaTask = await prisma.area_tasks.create({
    data: {
      site_id: site.site_id,
      task_id: task.task_id,
    }
  })

  // Insert schedule
  const schedule = await prisma.schedules.create({
    data: {
      area_task_id: areaTask.area_task_id,
      rule_type: scheduleRule,
      rrule: null,
      effective_from: effectiveFrom,
    }
  })

  // Debug output after successful insertion
  console.log('File upload info:', file)
  console.log('Company name:', companyName)
  console.log('Schedule frequency:', scheduleRule)
  console.log('Insertion result:', {
    fileId: fileRecord.file_id,
    siteId: site.site_id,
    taskId: task.task_id,
    scheduleId: schedule.schedule_id
  })

  return {
    message: 'Inserted successfully',
    fileId: fileRecord.file_id.toString(),
    siteId: site.site_id.toString(),
    taskId: task.task_id.toString(),
    areaTaskId: areaTask.area_task_id.toString(),
    scheduleId: schedule.schedule_id.toString(),
    result: {
      companyName,
      address,
      siteName,
      taskName,
      scheduleRule,
      effectiveFrom,
    }
  }
})


