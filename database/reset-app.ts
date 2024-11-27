import knex from 'knex'

import { parseDatabaseUrl } from '~/utils/database'

import { createDatabase } from './_lib/create-database'
import { dropDatabase } from './_lib/drop-database'
import { getEnvVariable } from './_lib/get-env-variables'

;(async () => {
  const databaseConfig = parseDatabaseUrl(getEnvVariable('DATABASE_URL'))

  const appKnex = knex({
    client: 'pg',
    connection: {
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.user,
      password: databaseConfig.password,
      database: 'postgres',
    },
  })

  // Удаляем базы если они существуют
  await dropDatabase(appKnex, databaseConfig.database)
  await dropDatabase(appKnex, '"dnp-operational-data"')
  await dropDatabase(appKnex, '"dnp-target-data"')
  await dropDatabase(appKnex, '"dnp-initial-data"')

  // Создаем базы
  await createDatabase(appKnex, databaseConfig.database)
  await createDatabase(appKnex, '"dnp-operational-data"')
  await createDatabase(appKnex, '"dnp-target-data"')
  await createDatabase(appKnex, '"dnp-initial-data"')

  process.exit(0)
})()
