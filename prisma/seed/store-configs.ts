import { type Prisma, type PrismaClient } from '@prisma/client'
import { users } from './users'
import { createId } from '@paralleldrive/cuid2'

const name = 'storeConfig'
type CreateInput = Prisma.StoreConfigUncheckedCreateInput

export const storeConfigs = [
  _create({
    kn: 'operational-tables',
    type: 'postgres',
    createdById: users[0].id,
    updatedById: users[0].id,
    createdAt: '2024-05-28T06:37:43.048Z',
    updatedAt: '2024-05-28T06:37:43.048Z',
    data: {
      username: 'asavchenko',
      password: 'Orion123',
      host: '10.4.40.2',
      port: '5432',
      dbName: 'dnp_dev_1',
    },
  }),
  _create({
    kn: 'target-tables',
    type: 'postgres',
    createdById: users[0].id,
    updatedById: users[0].id,
    createdAt: '2024-05-28T06:37:43.048Z',
    updatedAt: '2024-05-28T06:37:43.048Z',
    data: {
      username: 'asavchenko',
      password: 'Orion123',
      host: '10.4.40.2',
      port: '5432',
      dbName: 'dnp_dev_1',
    },
  }),
] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    kn: defaultValues.kn ?? createId(),
    type: defaultValues.type ?? 'postgres',
    createdById: users[0].id,
    updatedById: users[0].id,
    data: {
      username: 'asavchenko',
      password: 'Orion123',
      host: '10.4.40.2',
      port: '5432',
      dbName: 'dnp_dev_1',
    },
    ...defaultValues,
  }
  return instance
}

function _createOnIteration(_: unknown, i: number): CreateInput {
  return _create({ kn: `seeded-kn-${i}` })
}

export default async function seed(prisma: PrismaClient) {
  const generated = Array(20).fill(35).map(_createOnIteration)
  const allSeeds = [...generated, ...storeConfigs]
  const seedPromises = allSeeds.map((seed) => prisma[name].create({ data: seed }))
  return Promise.all([...seedPromises])
}
