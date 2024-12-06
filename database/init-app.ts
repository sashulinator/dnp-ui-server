import knex from 'knex'

import { PrismaService } from '~/slices/prisma'
import { StoreService } from '~/slices/store'
import { parseDatabaseUrl } from '~/utils/database'

import { getEnvVariable } from './_lib/get-env-variables'
import dcDatabaseList from './seeds/database-containers/database'
import dcSchemaList, { currentAppOperationalSchema } from './seeds/database-containers/schema'
import dcServiceList from './seeds/database-containers/service'
import queryFilters from './seeds/query-filter'
import { run } from './seeds/run'
import storeList from './seeds/store'

;(async () => {
  const prisma = new PrismaService()

  // Инициализируем переменные
  const databaseConfig = parseDatabaseUrl(getEnvVariable('DATABASE_URL'))

  const appKnex = knex({
    client: 'pg',
    connection: {
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.database,
    },
  })

  await prisma.dcService.createMany({ data: dcServiceList })
  await prisma.dcDatabase.createMany({ data: dcDatabaseList })
  await prisma.dcSchema.createMany({ data: dcSchemaList })

  const dcMedTable = await prisma.dcTable.create({
    data: {
      name: 'med',
      display: 'Мед',
      schemaId: currentAppOperationalSchema.id,
    },
  })

  const dcCarsTable = await prisma.dcTable.create({
    data: {
      name: 'cars',
      display: 'Автомобили',
      schemaId: currentAppOperationalSchema.id,
    },
  })

  const dcEmployeesTable = await prisma.dcTable.create({
    data: {
      name: 'employees',
      display: 'Работники',
      schemaId: currentAppOperationalSchema.id,
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
        type: 'integer',
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

  await prisma.queryFilter.createMany({ data: queryFilters })

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
          schemaId: currentAppOperationalSchema.id,
        },
      })
    })

  await Promise.all(promises)

  // Store
  new StoreService(prisma).createMany({ data: storeList })

  await run(appKnex)

  process.exit(0)
})()
