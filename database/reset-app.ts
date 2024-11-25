import knex from 'knex'

import { createDatabase } from './_lib/create-database'
import { dropDatabase } from './_lib/drop-database'
import { getDatabaseConfigMap } from './_lib/get-database-config-map'

;(async () => {
  // Инициализируем переменные
  const databaseConfigMap = getDatabaseConfigMap()

  const appKnex = knex({
    client: 'pg',
    connection: {
      host: databaseConfigMap.app.host,
      port: databaseConfigMap.app.port,
      user: databaseConfigMap.app.user,
      password: databaseConfigMap.app.password,
      database: 'postgres',
    },
  })

  const rawPostgresKnex = knex({
    client: 'pg',
    connection: {
      host: databaseConfigMap.raw.host,
      port: databaseConfigMap.raw.port,
      user: databaseConfigMap.raw.user,
      password: databaseConfigMap.raw.password,
      database: 'postgres',
    },
  })

  const targetPostgresKnex = knex({
    client: 'pg',
    connection: {
      host: databaseConfigMap.target.host,
      port: databaseConfigMap.target.port,
      user: databaseConfigMap.target.user,
      password: databaseConfigMap.target.password,
      database: 'postgres',
    },
  })

  const operationalPostgresKnex = knex({
    client: 'pg',
    connection: {
      host: databaseConfigMap.operational.host,
      port: databaseConfigMap.operational.port,
      user: databaseConfigMap.operational.user,
      password: databaseConfigMap.operational.password,
      database: 'postgres',
    },
  })

  // Удаляем базы если они существуют
  await dropDatabase(appKnex, databaseConfigMap.app.database)
  await dropDatabase(targetPostgresKnex, databaseConfigMap.target.database)
  await dropDatabase(operationalPostgresKnex, databaseConfigMap.operational.database)
  await dropDatabase(rawPostgresKnex, databaseConfigMap.raw.database)

  // Создаем базы
  await createDatabase(appKnex, databaseConfigMap.app.database)
  await createDatabase(rawPostgresKnex, databaseConfigMap.raw.database)
  await createDatabase(targetPostgresKnex, databaseConfigMap.target.database)
  await createDatabase(operationalPostgresKnex, databaseConfigMap.operational.database)

  process.exit(0)
})()
