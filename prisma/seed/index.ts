import { PrismaClient } from '@prisma/client'

import { seedNormalizationConfigs } from './normalization-config'
import { seedProcesses } from './processes'
import { seedTranslations } from './translations'
import { seedStoreConfigs } from './store-config'
import { seedIoConfig } from './io-configs'
import seedUsers from './users'
import { seedTables } from './tables'
import seedEntities from './entities'

const prisma = new PrismaClient()
async function main() {
  await seedUsers(prisma)
  console.log('Users seeded')
  await seedTables(prisma)
  console.log('Tables seeded')
  await seedEntities(prisma)
  console.log('Entities seeded')
  await seedNormalizationConfigs(prisma)
  console.log('NormalizationConfigs seeded')
  await seedStoreConfigs(prisma)
  console.log('StoreConfigs seeded')
  await seedIoConfig(prisma)
  console.log('IoConfigs seeded')
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
