import { type Prisma, PrismaClient } from '@prisma/client'

import { type Dictionary, isDev } from '~/utils/core'

import seedDictionaryTables from './dictionary-tables'
import seedDictionaryTablesData from './dictionary-tables-data'
import { seedNormalizationConfigs } from './normalization-configs'
import seedOperationalTables from './operational-tables'
import seedOperationalTablesData from './operational-tables-data'
import { seedProcesses } from './processes'
import seedStoreConfigs from './store-configs'
import seedTargetTables from './target-tables'
import { seedTranslations } from './translations'
import generateUser from './users/generate'
import userSeedList from './users/vital-seed-list'

const prisma = new PrismaClient()

async function main() {
  await seedWithPrisma(prisma, 'user', Array(20).fill(35).map(generateUser), [], userSeedList)
  console.log('Users seeded')

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

function seedWithPrisma(
  prisma: PrismaClient,
  entityName: Uncapitalize<keyof Prisma.TypeMap['model']>,
  generatedSeeds: Dictionary[],
  staticSeeds?: Dictionary[],
  vitalSeeds?: Dictionary[],
) {
  let seeds = []

  const isDev = process.env.NODE_ENV === 'development'

  if (isDev && generatedSeeds) seeds = [...seeds, ...generatedSeeds]
  if (isDev && staticSeeds) seeds = [...seeds, ...staticSeeds]
  if (vitalSeeds) seeds = [...seeds, ...vitalSeeds]

  const seedPromises = seeds.map((seed) => (prisma[entityName] as any).create({ data: seed }))

  return Promise.all([...seedPromises])
}
