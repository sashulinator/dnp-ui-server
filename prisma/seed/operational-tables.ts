import { type Prisma, type PrismaClient } from '@prisma/client'
import { users } from './users'
import { createId } from '@paralleldrive/cuid2'

const operationalTableName = 'operationalTable'
type CreateInput = Prisma.OperationalTableUncheckedCreateInput

export const operationalTables = [
  _create({ kn: 'translations', name: 'Переводы', tableName: 'Translation', nav: true }),
] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    kn: defaultValues.kn ?? createId(),
    name: defaultValues.name ?? createId(),
    nav: false,
    tableName: defaultValues.name ?? createId(),
    tableSchema: {
      items: [
        {
          id: 'id1',
          columnName: 'id',
          name: 'ID',
          type: 'string',
        },
        {
          id: 'id2',
          columnName: 'key',
          name: 'Ключ',
          type: 'string',
        },
        {
          id: 'id3',
          columnName: 'ns',
          name: 'Неймспейс',
          type: 'string',
        },
        {
          id: 'id4',
          columnName: 'locale',
          name: 'Локаль',
          type: 'string',
        },
        {
          id: 'id5',
          columnName: 'data',
          name: 'Содержание',
          type: 'string',
        },
      ],
      defaultView: 'table',
    },
    createdById: users[0].id,
    updatedById: users[0].id,
    ...defaultValues,
  }
  return instance
}

function _createOnIteration(_: unknown, i: number): CreateInput {
  return _create({ name: `seeded-name-${i}`, tableName: `seeded-tablename-${i}`, kn: `seeded-kn-${i}` })
}

export default async function seedOperationalTables(prisma: PrismaClient) {
  const generatedOperationalTables = Array(20).fill(35).map(_createOnIteration)
  const allSeeds = [...operationalTables, ...generatedOperationalTables]
  const seedPromises = allSeeds.map((seed) => prisma[operationalTableName].create({ data: seed }))
  return Promise.all([...seedPromises])
}
