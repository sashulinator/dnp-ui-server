import { createId } from '@paralleldrive/cuid2'
import { type Prisma, type PrismaClient } from '@prisma/client'

import vitalSeedList from './users/vital-seed-list'

const targetTableName = 'targetTable'
type CreateInput = Prisma.TargetTableUncheckedCreateInput

export const targetTables = [_create({ kn: 'first', name: 'first' })] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    kn: defaultValues.kn ?? createId(),
    name: defaultValues.name ?? createId(),
    nav: false,
    tableName: defaultValues.name ?? createId(),
    description: '',
    defaultView: 'table',
    items: [
      {
        id: 'id1',
        columnName: 'column1',
        name: 'Колонка1',
        type: 'string',
        maxLength: 50,
      },
      {
        id: 'id2',
        columnName: 'column2',
        name: 'Колонка2',
        type: 'string',
        maxLength: 50,
      },
      {
        id: 'id3',
        columnName: 'column3',
        name: 'Колонка3',
        type: 'string',
        maxLength: 50,
      },
    ],
    createdById: vitalSeedList[0].id,
    updatedById: vitalSeedList[0].id,
    ...defaultValues,
  }
  return instance
}

function _createOnIteration(_: unknown, i: number): CreateInput {
  return _create({ name: `seeded-name-${i}`, tableName: `seeded-tablename-${i}`, kn: `seeded-kn-${i}` })
}

export default async function seedtargetTables(prisma: PrismaClient) {
  const generatedtargetTables = Array(20).fill(35).map(_createOnIteration)
  const allSeeds = [...targetTables, ...generatedtargetTables]
  const seedPromises = allSeeds.map((seed) => prisma[targetTableName].create({ data: seed }))
  return Promise.all([...seedPromises])
}
