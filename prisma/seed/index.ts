import { PrismaClient } from '@prisma/client'

import { seedNormalizationConfigs } from './normalization-config'
import { seedTranslations } from './translations'

const prisma = new PrismaClient()
async function main() {
  await seedNormalizationConfigs(prisma)
  console.log('Seeded normalization configs')
  await seedTranslations(prisma)
  console.log('Seeded translations')
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
