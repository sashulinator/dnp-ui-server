import { getEnvVariable } from 'database/_lib/get-env-variables'
import knex from 'knex'

import { parseDatabaseUrl } from '~/utils/database'

import { run } from './run'

async function emit() {
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

  run(appKnex)
}

;(() => {
  emit().then(() => process.exit(0))
})()
