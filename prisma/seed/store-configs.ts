import { type Prisma, type PrismaClient } from '@prisma/client'

export const storeConfig1: Prisma.StoreConfigUncheckedCreateInput = {
  kn: 'first',
  type: 'jdbc',
  createdById: 'tz4a98xxat96iws9zmbrgj3a',
  updatedById: 'tz4a98xxat96iws9zmbrgj3a',
  createdAt: '2024-05-28T06:37:43.048Z',
  updatedAt: '2024-05-28T06:37:43.048Z',
  data: {
    host: '10.4.40.2',
    port: '5432',
    username: 'asavchenko',
    password: 'Orion123',
    database: 'dnp_dev_1',
  },
}

export async function seedStoreConfigs(prisma: PrismaClient) {
  const seedPromise = prisma.storeConfig.create({
    data: storeConfig1,
  })

  const seedPromises = Array(20)
    .fill(undefined)
    .map((_, i) => {
      return prisma.storeConfig.create({
        data: { ...storeConfig1, kn: `seed-${i}` },
      })
    })

  return Promise.all([...seedPromises, seedPromise])
}
