import { PrismaClient } from '@prisma/client'

import knex from 'knex'

import { getDatabaseConfigMap } from './_lib/get-database-config-map'
import { run } from './seeds/run'

;(async () => {
  const prisma = new PrismaClient()

  // Инициализируем переменные
  const databaseConfigMap = getDatabaseConfigMap()

  const appKnex = knex({
    client: 'pg',
    connection: {
      host: databaseConfigMap.app.host,
      port: databaseConfigMap.app.port,
      user: databaseConfigMap.app.user,
      password: databaseConfigMap.app.password,
      database: databaseConfigMap.app.database,
    },
  })

  const service = await prisma.dcService.create({
    data: {
      display: 'App',
      host: databaseConfigMap.operational.host,
      port: Number(databaseConfigMap.operational.port),
      username: databaseConfigMap.operational.user,
      password: databaseConfigMap.operational.password,
    },
  })

  const dcDatabase = await prisma.dcDatabase.create({
    data: {
      display: 'Operational',
      name: 'operational',
      serviceId: service.id,
    },
  })

  const dcSchema = await prisma.dcSchema.create({
    data: {
      display: 'Public',
      name: 'public',
      databaseId: dcDatabase.id,
    },
  })

  const dcMedTable = await prisma.dcTable.create({
    data: {
      name: 'med',
      display: 'Мед',
      schemaId: dcSchema.id,
    },
  })

  const dcCarsTable = await prisma.dcTable.create({
    data: {
      name: 'cars',
      display: 'Автомобили',
      schemaId: dcSchema.id,
    },
  })

  const dcEmployeesTable = await prisma.dcTable.create({
    data: {
      name: 'employees',
      display: 'Работники',
      schemaId: dcSchema.id,
    },
  })

  await prisma.dcColumn.createMany({
    data: [
      {
        name: 'name',
        display: 'Название',
        type: 'string',
        tableId: dcMedTable.id,
      },
      {
        name: 'price',
        display: 'Цена',
        type: 'int',
        tableId: dcMedTable.id,
      },
      {
        name: 'articul',
        display: 'Артикул',
        type: 'string',
        tableId: dcMedTable.id,
      },
      {
        name: 'group',
        display: 'Группа',
        type: 'string',
        tableId: dcMedTable.id,
      },
    ],
  })

  await prisma.dcColumn.createMany({
    data: [
      {
        name: 'model',
        display: 'Модель',
        type: 'string',
        tableId: dcCarsTable.id,
      },
      {
        name: 'brand',
        display: 'Бренд',
        type: 'string',
        tableId: dcCarsTable.id,
      },
    ],
  })

  await prisma.dcColumn.createMany({
    data: [
      {
        name: 'employeesId',
        display: 'Id',
        type: 'string',
        tableId: dcEmployeesTable.id,
      },
      {
        name: 'firstName',
        display: 'Имя',
        type: 'string',
        tableId: dcEmployeesTable.id,
      },
      {
        name: 'secondName',
        display: 'Фамилия',
        type: 'string',
        tableId: dcEmployeesTable.id,
      },
    ],
  })

  const promises = Array(5)
    .fill(undefined)
    .map((_, i) => {
      return prisma.dcTable.create({
        data: {
          name: `tableWithoutColumns-${i}`,
          display: `tableWithoutColumns-${i}`,
          schemaId: dcSchema.id,
        },
      })
    })

  await Promise.all(promises)

  await run(appKnex, databaseConfigMap)

  process.exit(0)
})()
