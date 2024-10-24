import { createId } from '@paralleldrive/cuid2'
import { type Prisma, type PrismaClient } from '@prisma/client'

import { systemUser } from '../../database/create/data/users'
import { SYSNAME } from '../../src/shared/working-tables/constant/name'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseDbUrl = require('parse-database-url')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbEnvConfig = require('dotenv').config().parsed as {
  DATABASE_URL?: string
  TABLES_DATABASE_URL?: string
}

const parsedDbUrl = parseDbUrl(dbEnvConfig.TABLES_DATABASE_URL || dbEnvConfig.DATABASE_URL) as {
  user: string
  password: string
  database: string
  host: string
  port: string
}

const name = 'storeConfig'
type CreateInput = Prisma.StoreConfigUncheckedCreateInput

export const storeConfigs = [
  _create({
    kn: SYSNAME,
    type: 'postgres',
    createdById: systemUser.id,
    updatedById: systemUser.id,
    createdAt: '2024-05-28T06:37:43.048Z',
    updatedAt: '2024-05-28T06:37:43.048Z',
    data: {
      username: parsedDbUrl.user,
      password: parsedDbUrl.password,
      host: parsedDbUrl.host,
      port: parsedDbUrl.port,
      dbName: parsedDbUrl.database,
    },
  }),
] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    kn: defaultValues.kn ?? createId(),
    type: defaultValues.type ?? 'postgres',
    createdById: systemUser.id,
    updatedById: systemUser.id,
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
  const generated = Array(0).fill(undefined).map(_createOnIteration)
  const allSeeds = [...generated, ...storeConfigs]
  const seedPromises = allSeeds.map((seed) => prisma[name].create({ data: seed }))
  return Promise.all([...seedPromises])
}
