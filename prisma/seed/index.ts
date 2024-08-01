import { PrismaClient } from '@prisma/client'

import { seedNormalizationConfigs } from './normalization-config'
import { seedProcesses } from './processes'
import { seedTranslations } from './translations'
import { seedStoreConfigs } from './store-config'
import seedUsers from './users'
import seedTableSchemas from './table-schemas'
import seedEntities from './entities'

const prisma = new PrismaClient()
async function main() {
  await seedUsers(prisma)
  console.log('Users seeded')
  await seedTableSchemas(prisma)
  console.log('TableSchemas seeded')
  await seedEntities(prisma)
  console.log('Entities seeded')
  await seedNormalizationConfigs(prisma)
  console.log('NormalizationConfigs seeded')
  await seedStoreConfigs(prisma)
  console.log('StoreConfigs seeded')
  await seedProcesses(prisma)
  console.log('Processes seeded')
  await seedTranslations(prisma)
  console.log('Translations seeded')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
