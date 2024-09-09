import { PrismaClient } from '@prisma/client'

import { seedNormalizationConfigs } from './normalization-configs'
import { seedProcesses } from './processes'
import { seedTranslations } from './translations'
import seedStoreConfigs from './store-configs'
import seedUsers from './users'
import seedTableSchemas from './table-schemas'
import seedTargetTables from './target-tables'
import seedDictionaryTables from './dictionary-tables'
import seedDictionaryTablesData from './dictionary-tables-data'
import seedOperationalTables from './operational-tables'
import seedOperationalTablesData from './operational-tables-data'

const prisma = new PrismaClient()

async function main() {
  await seedUsers(prisma)
  console.log('Users seeded')

  await seedTableSchemas(prisma)
  console.log('TableSchemas seeded')

  await seedDictionaryTables(prisma)
  console.log('DictionaryTables seeded')

  await seedOperationalTables(prisma)
  console.log('OperationalTables seeded')

  await seedTargetTables(prisma)
  console.log('TargetTables seeded')

  await seedNormalizationConfigs(prisma)
  console.log('NormalizationConfigs seeded')

  await seedStoreConfigs(prisma)
  console.log('StoreConfigs seeded')

  await seedProcesses(prisma)
  console.log('Processes seeded')

  await seedTranslations(prisma)
  console.log('Translations seeded')

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
