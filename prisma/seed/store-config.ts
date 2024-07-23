import { type Prisma, type PrismaClient } from '@prisma/client'

export const storeConfig1: Prisma.StoreConfigCreateInput = {
  keyname: 'first',
  type: 'jdbc',
  createdBy: 'tz4a98xxat96iws9zmbrgj3a',
  updatedBy: 'tz4a98xxat96iws9zmbrgj3a',
  createdAt: '2024-05-28T06:37:43.048Z',
  updatedAt: '2024-05-28T06:37:43.048Z',
  data: {
    bucket: 'dnp-case-1',
    format: 'csv',
    options: {
      escape: '"',
      header: 'true',
      inferSchema: true,
    },
    'dataset-path': 'data/csv',
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
        data: { ...storeConfig1, keyname: `seed-${i}` },
      })
    })

  return Promise.all([...seedPromises, seedPromise])
}
