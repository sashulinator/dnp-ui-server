import { createId } from '@paralleldrive/cuid2'
import { type Prisma, type PrismaClient } from '@prisma/client'

import vitalSeedList from './users/vital-seed-list'

const dictionaryTableName = 'dictionaryTable'
type CreateInput = Prisma.DictionaryTableUncheckedCreateInput

export const dictionaryTables = [
  _create({
    kn: 'countries',
    name: 'Страны',
    tableName: 'countries',
    nav: true,
    tableSchema: {
      defaultView: 'table',
      items: [
        {
          id: 'id1',
          columnName: 'code',
          name: 'Код',
          type: 'string',
          primary: true,
          maxLength: 2,
        },
        {
          id: 'id2',
          columnName: 'name',
          name: 'Название',
          type: 'string',
          unique: false,
          maxLength: 50,
        },
        {
          id: 'id3',
          columnName: 'dial_code',
          name: 'Телефоный код',
          type: 'string',
          unique: false,
          maxLength: 5,
        },
      ],
    },
  }),
  _create({
    kn: 'employeess',
    name: 'Работники',
    tableName: 'workers',
    nav: true,
    tableSchema: {
      defaultView: 'table',
      items: [
        {
          id: 'id1',
          columnName: 'id',
          name: 'ID',
          type: 'string',
          index: true,
          unique: false,
          primary: true,
          maxLength: 50,
        },
        {
          id: 'id2',
          columnName: 'firstname',
          name: 'Имя',
          type: 'string',
          index: true,
          unique: false,
          maxLength: 50,
        },
        {
          id: 'id3',
          columnName: 'secondname',
          name: 'Фамилия',
          type: 'string',
          index: false,
          unique: false,
          maxLength: 50,
        },
        {
          id: 'id4',
          columnName: 'sex',
          name: 'Пол',
          type: 'string',
          unique: false,
          maxLength: 10,
        },
        {
          id: 'id5',
          columnName: 'age',
          name: 'Возраст',
          type: 'integer',
          unique: false,
          maxLength: 3,
          isNegativeAllowed: false,
        },
      ],
    },
  }),
  _create({
    kn: 'rfSubjects',
    name: 'Субьекты РФ',
    tableName: 'rf_subjects',
    nav: true,
    tableSchema: {
      defaultView: 'table',
      items: [
        {
          id: 'id1',
          columnName: 'capital',
          name: 'Столица',
          type: 'string',
          maxLength: 50,
        },
        {
          id: 'id2',
          columnName: 'name',
          name: 'Название',
          type: 'string',
          unique: false,
          maxLength: 50,
        },
        {
          id: 'id3',
          columnName: 'region_code',
          name: 'Код региона',
          type: 'string',
          primary: true,
          maxLength: 3,
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
    createdById: vitalSeedList[0].id,
    updatedById: vitalSeedList[0].id,
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
