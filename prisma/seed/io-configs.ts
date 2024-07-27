import { type Prisma, type PrismaClient } from '@prisma/client'
import { storeConfig1 } from './store-config'

const ioConfig: Prisma.IoConfigUncheckedCreateInput = {
  kn: 'first',
  type: 'jdbc',
  createdBy: 'tz4a98xxat96iws9zmbrgj3a',
  updatedBy: 'tz4a98xxat96iws9zmbrgj3a',
  storeConfigKn: storeConfig1.kn,
  data: {
    tableName: 'Process',
  },
}

export async function seedIoConfig(prisma: PrismaClient) {
  const seedPromise = prisma.ioConfig.create({
    data: ioConfig,
  })

  const seedPromises = Array(20)
    .fill(undefined)
    .map((_, i) => {
      return prisma.ioConfig.create({
        data: { ...ioConfig, kn: `seed-${i}` },
      })
    })

  return Promise.all([...seedPromises, seedPromise])
}
