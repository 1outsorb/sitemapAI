import { PrismaClient } from '@prisma/client'
import { IncomingForm } from 'formidable'
import fs from 'fs/promises'
import { analyzeDocumentWithCustomModel, analyzeDocumentWithAltModel } from '~/server/azure'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const form = new IncomingForm()

  const data = await new Promise<{ file: any; fields: any }>((resolve, reject) => {
    form.parse(event.req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ file: files.file[0], fields })
    })
  })

  const file = data.file
  const buffer = await fs.readFile(file.filepath)

  const sha256 = createHash('sha256').update(buffer).digest('hex')

  const modelField = data.fields?.model
  const modelValue = Array.isArray(modelField) ? modelField[0] : modelField
  const useAltModel = modelValue === 'alt'

  const resultAzure = useAltModel
    ? await analyzeDocumentWithAltModel(buffer)
    : await analyzeDocumentWithCustomModel(buffer)

  const modelUsed = useAltModel ? 'alt' : 'default'

  const fields = resultAzure?.documents?.[0]?.fields || {}

  const companyName = fields.company_name?.content ?? 'Unknown Company'
  const address = fields.company_address?.content ?? 'Unknown Address'
  const siteName = fields.area_task_id?.content ?? 'Unknown Site'
  const taskName = fields.Task?.content ?? 'Unknown Task'
  const frequency = fields.Frequency?.content?.toUpperCase() ?? 'Unknown Frequency'
  const effectiveFromRaw = fields.EffectiveFrom?.content

  const validRules = ['WEEKLY', 'MONTHLY', 'ONE_OFF']
  const scheduleRule = validRules.includes(frequency) ? frequency : 'ONE_OFF'

  let effectiveFrom: Date | null = null
  if (effectiveFromRaw) {
    try {
      effectiveFrom = new Date(effectiveFromRaw)
    } catch {
      console.warn('Date parsing failed:', effectiveFromRaw)
    }
  }

  let fileRecord = await prisma.files.findUnique({ where: { sha256 } })
  if (!fileRecord) {
    fileRecord = await prisma.files.create({
      data: {
        file_name: file.originalFilename,
        file_size: file.size,
        file_type: file.mimetype,
        sha256,
      }
    })
  }

  const company = await prisma.company.create({
    data: { company_name: companyName, company_address: address }
  })

  const site = await prisma.sites.create({
    data: { company_id: company.company_id, site_name: siteName }
  })

  let task = await prisma.tasks.findFirst({ where: { task_name: taskName } })
  if (!task) {
    task = await prisma.tasks.create({ data: { task_name: taskName } })
  }

  const areaTask = await prisma.area_tasks.create({
    data: { site_id: site.site_id, task_id: task.task_id }
  })

  const schedule = await prisma.schedules.create({
    data: { area_task_id: areaTask.area_task_id, rule_type: scheduleRule, effective_from: effectiveFrom }
  })

  const rawTable = fields.Area_based_task?.values ?? []
  const areaBasedTaskTable = rawTable.map((row: any) => {
    const props = row.properties || {}
    const rowObj: Record<string, string> = {}
    for (const [col, cell] of Object.entries(props)) {
      rowObj[col] = (cell as any)?.value ?? ''
    }
    return rowObj
  })

  const simplifiedResult = {
    message: 'Inserted successfully',
    modelUsed,
    fileId: fileRecord.file_id.toString(),
    siteId: site.site_id.toString(),
    taskId: task.task_id.toString(),
    areaTaskId: areaTask.area_task_id.toString(),
    scheduleId: schedule.schedule_id.toString(),
    companyName,
    address,
    siteName,
    taskName,
    scheduleRule,
    effectiveFrom,
    areaBasedTaskTable,
  }

  const extractContent = await prisma.extract_content.create({
    data: {
      file_id: fileRecord.file_id,
      raw_content: simplifiedResult,
    }
  })

  return {
    result: {
      ...simplifiedResult,
      extractContentId: extractContent.id.toString(),
    }
  }
})
