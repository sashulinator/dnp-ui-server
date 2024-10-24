import { createId } from '@paralleldrive/cuid2'
import { type Prisma, type PrismaClient } from '@prisma/client'

import { systemUser } from '../../database/create/data/users'

const operationalTableName = 'operationalTable'
type CreateInput = Prisma.OperationalTableUncheckedCreateInput

export const operationalTables = [
  _create({
    kn: 'cars',
    name: 'Автомобили',
    tableName: 'cars',
    nav: true,
    description: '',
    columns: [
      {
        id: 'id1',
        columnName: 'carsId',
        name: 'ID',
        type: 'string',
        index: true,
        unique: true,
        maxLength: 50,
      },
      {
        id: 'id2',
        columnName: 'brand',
        name: 'Фирма',
        type: 'string',
        index: true,
        maxLength: 50,
      },
      {
        id: 'id3',
        columnName: 'model',
        name: 'Модель',
        type: 'string',
        index: true,
        maxLength: 50,
      },
      {
        id: 'id4',
        columnName: 'year',
        name: 'Год выпуска',
        type: 'string',
        maxLength: 50,
      },
      {
        id: 'id5',
        columnName: 'employeesId',
        name: 'Водитель',
        type: 'string',
        maxLength: 50,
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
  }),
  _create({
    kn: 'employees',
    name: 'Работники',
    tableName: 'employees',
    nav: true,
    description: '',
    defaultView: 'table',
    columns: [
      {
        id: 'id1',
        columnName: 'employeesId',
        name: 'ID',
        type: 'string',
        unique: true,
        index: true,
        maxLength: 50,
      },
      {
        id: 'id2',
        columnName: 'firstName',
        name: 'Имя',
        type: 'string',
        index: true,
        maxLength: 50,
      },
      {
        id: 'id3',
        columnName: 'secondName',
        name: 'Фамилия',
        type: 'string',
        index: true,
        maxLength: 50,
      },
    ],
  }),
] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    kn: defaultValues.kn ?? createId(),
    name: defaultValues.name ?? createId(),
    nav: false,
    description: '',
    tableName: defaultValues.name ?? createId(),
    columns: [
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
    createdById: systemUser.id,
    updatedById: systemUser.id,
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
