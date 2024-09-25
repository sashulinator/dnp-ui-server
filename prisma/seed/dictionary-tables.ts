import { createId } from '@paralleldrive/cuid2'
import { type Prisma, type PrismaClient } from '@prisma/client'

import { users } from './users'

const dictionaryTableName = 'dictionaryTable'
type CreateInput = Prisma.DictionaryTableUncheckedCreateInput

export const dictionaryTables = [
  _create({
    kn: 'dictionary',
    name: 'Виды животных',
    tableName: 'Animals',
    nav: true,
    tableSchema: {
      defaultView: 'table',
      items: [
        {
          id: 'animal_1',
          columnName: 'ID',
          name: 'ID',
          type: 'string',
          index: true,
          unique: true,
          maxLength: 50,
        },
        {
          id: 'animal_2',
          columnName: 'Название',
          name: 'Название',
          type: 'string',
          index: false,
          unique: false,
          maxLength: 50,
        },
        {
          id: 'animal_3',
          columnName: 'Тип',
          name: 'Тип',
          type: 'string',
          index: true,
          unique: false,
          maxLength: 50,
        },
        {
          id: 'animal_4',
          columnName: 'Среда обитания',
          name: 'Среда обитания',
          type: 'string',
          index: false,
          unique: false,
          maxLength: 50,
        },
        {
          id: 'animal_5',
          columnName: 'Размер',
          name: 'Размер',
          type: 'string',
          index: false,
          unique: false,
          maxLength: 50,
        },
        {
          id: 'animal_6',
          columnName: 'Вес',
          name: 'Вес',
          type: 'string',
          index: false,
          unique: false,
          maxLength: 50,
        },
      ],
    },
  }),
  _create({
    kn: 'employeess',
    name: 'Работники',
    tableName: 'employees',
    nav: true,
    tableSchema: {
      defaultView: 'table',
      items: [
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
      defaultView: 'table',
      items: [
        {
          id: 'id1',
          columnName: 'column1',
          name: 'Колонка1',
          type: 'string',
          maxLength: 1,
        },
        {
          id: 'id2',
          columnName: 'column2',
          name: 'Колонка2',
          type: 'string',
          maxLength: 1,
        },
        {
          id: 'id3',
          columnName: 'column3',
          name: 'Колонка3',
          type: 'string',
          maxLength: 1,
        },
      ],
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

export default async function seedDictionaryTables(prisma: PrismaClient) {
  const generatedDictionaryTables = Array(20).fill(35).map(_createOnIteration)
  const allSeeds = [...dictionaryTables, ...generatedDictionaryTables]
  const seedPromises = allSeeds.map((seed) => prisma[dictionaryTableName].create({ data: seed }))
  return Promise.all([...seedPromises])
}
