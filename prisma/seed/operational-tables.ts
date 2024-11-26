import { createId } from '@paralleldrive/cuid2'
import { type Prisma, type PrismaClient } from '@prisma/client'

import { systemUser } from '../../database/seeds/users'

const operationalTableName = 'operationalTable'
type CreateInput = Prisma.OperationalTableUncheckedCreateInput

export const operationalTables = [
  _create({
    kn: 'cars',
    display: 'Автомобили',
    name: 'cars',
    nav: true,
    description: '',
    columns: [
      {
        id: 'id2',
        name: 'brand',
        display: 'Фирма',
        type: 'string',
        index: true,
        maxLength: 50,
      },
      {
        id: 'id3',
        name: 'model',
        display: 'Модель',
        type: 'string',
        index: true,
        maxLength: 50,
      },
    ],
    defaultView: 'table',
  }),
  _create({
    kn: 'employees',
    display: 'Работники',
    name: 'employees',
    nav: true,
    description: '',
    defaultView: 'table',
    columns: [
      {
        id: 'id1',
        name: 'employeesId',
        display: 'ID',
        type: 'string',
        unique: true,
        index: true,
        maxLength: 50,
      },
      {
        id: 'id2',
        name: 'firstName',
        display: 'Имя',
        type: 'string',
        index: true,
        maxLength: 50,
      },
      {
        id: 'id3',
        name: 'secondName',
        display: 'Фамилия',
        type: 'string',
        index: true,
        maxLength: 50,
      },
    ],
  }),
  _create({
    kn: 'dataset',
    display: 'Эталонный датасет',
    name: 'dataset',
    nav: true,
    description: '',
    defaultView: 'table',
    columns: [
      {
        id: 'id1',
        name: 'code',
        display: 'Код',
        type: 'string',
        unique: true,
        index: true,
        maxLength: 255,
      },
      {
        id: 'id2',
        name: 'name',
        display: 'Наименование',
        type: 'string',
        index: true,
        maxLength: 255,
      },
      {
        id: 'id3',
        name: 'ntd',
        display: 'НТД',
        type: 'string',
        index: true,
        maxLength: 255,
      },
      {
        id: 'id4',
        name: 'ntd_material',
        display: 'НТД на материал',
        type: 'string',
        index: true,
        maxLength: 255,
      },
      {
        id: 'id5',
        name: 'classificator_ens',
        display: 'Классификатор ЕНС',
        type: 'string',
        index: true,
        maxLength: 255,
      },
      {
        id: 'id6',
        name: 'classificator_ens_code',
        display: 'Классификатор ЕНС: код',
        type: 'string',
        index: true,
        maxLength: 255,
      },
      {
        id: 'id7',
        name: 'is_name_correct',
        display: 'Корректно ли сформировано наименование',
        type: 'string',
        index: true,
        maxLength: 255,
      },
    ],
  }),
  _create({
    kn: 'med',
    display: 'Медицина',
    name: 'med',
    nav: true,
    description: 'med',
    defaultView: 'table',
    columns: [
      {
        id: 'id1',
        name: 'id',
        display: 'ID',
        type: 'string',
        unique: true,
        index: true,
        maxLength: 50,
      },
      {
        id: 'id2',
        name: 'articul',
        display: 'Артикул',
        type: 'string',
        index: true,
        maxLength: 50,
      },
      {
        id: 'id3',
        name: 'group',
        display: 'Группа',
        type: 'string',
        index: true,
        maxLength: 50,
      },
      {
        id: 'id4',
        name: 'name',
        display: 'Название',
        type: 'string',
        maxLength: 50,
      },
      {
        id: 'id5',
        name: 'price',
        display: 'цена',
        type: 'integer',
        maxLength: 50,
      },
      {
        id: 'id6',
        name: 'source',
        display: 'Источник',
        type: 'string',
        maxLength: 50,
      },
      {
        id: 'id7',
        name: 'comment1',
        display: 'comment1',
        type: 'string',
        maxLength: 50,
      },
      {
        id: 'id8',
        name: 'comment2',
        display: 'comment2',
        type: 'string',
        maxLength: 50,
      },
      {
        id: 'id8',
        name: 'comment3',
        display: 'comment3',
        type: 'string',
        maxLength: 50,
      },
    ],
  }),
] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    kn: defaultValues.kn ?? createId(),
    display: defaultValues.display ?? createId(),
    nav: false,
    description: '',
    name: defaultValues.display ?? createId(),
    columns: [
      {
        id: 'id1',
        name: 'column1',
        display: 'Колонка1',
        type: 'string',
      },
      {
        id: 'id2',
        name: 'column2',
        display: 'Колонка2',
        type: 'string',
      },
      {
        id: 'id3',
        name: 'column3',
        display: 'Колонка3',
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
  return _create({ display: `seeded-name-${i}`, name: `seeded-tablename-${i}`, kn: `seeded-kn-${i}` })
}

export default async function seedOperationalTables(prisma: PrismaClient) {
  const generatedOperationalTables = Array(0).fill(undefined).map(_createOnIteration)
  const allSeeds = [...operationalTables, ...generatedOperationalTables]
  const seedPromises = allSeeds.map((seed) => prisma[operationalTableName].create({ data: seed }))
  return Promise.all([...seedPromises])
}
