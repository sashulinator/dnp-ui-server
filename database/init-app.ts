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

  await appKnex.schema.createTable('analyticsReport', (tableBuilder) => {
    tableBuilder.string('id').primary()
    tableBuilder.string('table')
    tableBuilder.string('stats')
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

  const dcTable = await prisma.dcTable.create({
    data: {
      name: 'med',
      display: 'Мед',
      schemaId: dcSchema.id,
    },
  })

  await prisma.dcColumn.createMany({
    data: [
      {
        name: 'name',
        display: 'Название',
        tableId: dcTable.id,
      },
      {
        name: 'price',
        display: 'Цена',
        tableId: dcTable.id,
      },
      {
        name: 'articul',
        display: 'Артикул',
        tableId: dcTable.id,
      },
      {
        name: 'group',
        display: 'Группа',
        tableId: dcTable.id,
      },
    ],
  })

  await prisma.dcTable.create({
    data: {
      name: 'tableWithoutColumns',
      display: 'tableWithoutColumns',
      schemaId: dcSchema.id,
    },
  })

  await run(appKnex, databaseConfigMap)

  process.exit(0)
})()
