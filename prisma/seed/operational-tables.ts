import { type Prisma, type PrismaClient } from '@prisma/client'
import { users } from './users'
import { createId } from '@paralleldrive/cuid2'

const operationalTableName = 'operationalTable'
type CreateInput = Prisma.OperationalTableUncheckedCreateInput

export const operationalTables = [
  _create({
    kn: 'cars',
    name: 'Автомобили',
    tableName: 'cars',
    nav: true,
    tableSchema: {
      items: [
        {
          id: 'id1',
          columnName: 'carsId',
          name: 'ID',
          type: 'string',
          unique: true,
        },
        {
          id: 'id2',
          columnName: 'brand',
          name: 'Фирма',
          type: 'string',
        },
        {
          id: 'id3',
          columnName: 'model',
          name: 'Модель',
          type: 'string',
        },
        {
          id: 'id4',
          columnName: 'year',
          name: 'Год выпуска',
          type: 'string',
        },
        {
          id: 'id5',
          columnName: 'employeesId',
          name: 'Водитель',
          type: 'employeesId',
          relation: {
            type: 'operationalTable',
            kn: 'employees',
            // TODO делаю tableName вместо kn потому что так проще сидить
            tableName: 'employees',
            columnName: 'employeesId',
          },
        },
      ],
      defaultView: 'table',
    },
  }),
  _create({
    kn: 'employees',
    name: 'Работники',
    tableName: 'employees',
    nav: true,
    tableSchema: {
      items: [
        {
          id: 'id1',
          columnName: 'employeesId',
          name: 'ID',
          type: 'string',
          unique: true,
        },
        {
          id: 'id2',
          columnName: 'firstName',
          name: 'Имя',
          type: 'string',
        },
        {
          id: 'id3',
          columnName: 'secondName',
          name: 'Имя',
          type: 'string',
        },
      ],
      defaultView: 'table',
    },
  }),
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
          columnName: 'column1',
          name: 'Колонка1',
          type: 'string',
        },
        {
          id: 'id2',
          columnName: 'column2',
          name: 'Колонка2',
          type: 'string',
        },
        {
          id: 'id3',
          columnName: 'column3',
          name: 'Колонка3',
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
