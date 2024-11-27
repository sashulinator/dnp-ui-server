import { PrismaClient } from '@prisma/client'

import { seedAnalyticalActions } from './analytical-actions'
import seedDictionaryTablesData from './dictionary-tables-data'
import seedOperationalTables from './operational-tables'
import seedOperationalTablesData from './operational-tables-data'
import seedTargetTables from './target-tables'
import { seedTranslations } from './translations'

const prisma = new PrismaClient()

async function main() {
  await seedOperationalTables(prisma)
  console.log('OperationalTables seeded')

  await seedTargetTables(prisma)
  console.log('TargetTables seeded')

  await seedTranslations(prisma)
  console.log('Translations seeded')

  await seedAnalyticalActions(prisma)
  console.log('AnalyticalActions seeded')

  // knex

  await seedDictionaryTablesData()
  console.log('DictionaryTablesData seeded')

  await seedOperationalTablesData()
  console.log('OperationalTablesData seeded')
}

;(async function app() {
  try {
    await main()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
