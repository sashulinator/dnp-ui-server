import { createId } from '@paralleldrive/cuid2'
import { type Prisma, type PrismaClient } from '@prisma/client'

import { systemUser } from '../../database/create/data/users'

const targetTableName = 'targetTable'
type CreateInput = Prisma.TargetTableUncheckedCreateInput

export const targetTables = [_create({ kn: 'first', display: 'first' })] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    kn: defaultValues.kn ?? createId(),
    display: defaultValues.display ?? createId(),
    nav: false,
    name: defaultValues.display ?? createId(),
    description: '',
    defaultView: 'table',
    columns: [
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
    createdById: systemUser.id,
    updatedById: systemUser.id,
    ...defaultValues,
  }
  return instance
}

function _createOnIteration(_: unknown, i: number): CreateInput {
  return _create({ display: `seeded-name-${i}`, name: `seeded-tablename-${i}`, kn: `seeded-kn-${i}` })
}

export default async function seedtargetTables(prisma: PrismaClient) {
  const generatedtargetTables = Array(20).fill(35).map(_createOnIteration)
  const allSeeds = [...targetTables, ...generatedtargetTables]
  const seedPromises = allSeeds.map((seed) => prisma[targetTableName].create({ data: seed }))
  return Promise.all([...seedPromises])
}
