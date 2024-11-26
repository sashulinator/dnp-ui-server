import { createId } from '@paralleldrive/cuid2'
import { type Prisma, type PrismaClient } from '@prisma/client'

import { systemUser } from '../../database/seeds/users'

const targetTableName = 'targetTable'
type CreateInput = Prisma.TargetTableUncheckedCreateInput

export const targetTables = [
  _create({ kn: 'first', display: 'first' }),
  _create({
    kn: 'analytics_report',
    display: 'Результаты профилирования',
    columns: [
      {
        id: 'id0',
        name: 'id',
        display: 'ID',
        type: 'string',
      },
      {
        id: 'id1',
        name: 'table_name',
        display: 'Название таблицы',
        type: 'string',
      },
      {
        id: 'id2',
        name: 'column_name',
        display: 'Название колонки',
        type: 'string',
      },
      {
        id: 'id3',
        name: 'metric_name',
        display: 'Название Метрики',
        type: 'string',
      },
      {
        id: 'id4',
        name: 'result_value',
        display: 'Результат',
        type: 'string',
      },
    ],
  }),
] as const

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
        name: 'column1',
        display: 'Колонка1',
        type: 'string',
        maxLength: 50,
      },
      {
        id: 'id2',
        name: 'column2',
        display: 'Колонка2',
        type: 'string',
        maxLength: 50,
      },
      {
        id: 'id3',
        name: 'column3',
        display: 'Колонка3',
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
  const generatedtargetTables = Array(0).fill(undefined).map(_createOnIteration)
  const allSeeds = [...targetTables, ...generatedtargetTables]
  const seedPromises = allSeeds.map((seed) => prisma[targetTableName].create({ data: seed }))
  return Promise.all([...seedPromises])
}
