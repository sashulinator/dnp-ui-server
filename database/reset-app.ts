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
  await dropDatabase(appKnex, 'operational')
  await dropDatabase(appKnex, 'target')
  await dropDatabase(appKnex, 'initial')

  // Создаем базы
  await createDatabase(appKnex, databaseConfig.database)
  await createDatabase(appKnex, 'operational')
  await createDatabase(appKnex, 'target')
  await createDatabase(appKnex, 'initial')

  process.exit(0)
})()
