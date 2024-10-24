import knex from 'knex'

import { asyncCatchError } from '../_lib/catch-error'
import { getOperationalDatabaseConfig } from '../_lib/get-database-config'

export async function dropOperationalDatabase() {
  const operationalDatabaseConfig = getOperationalDatabaseConfig()

  const k = knex({
    client: 'pg',
    connection: {
      host: operationalDatabaseConfig.host,
      port: operationalDatabaseConfig.port,
      user: operationalDatabaseConfig.user,
      password: operationalDatabaseConfig.password,
      database: 'postgres',
    },
  })

  const [error] = await asyncCatchError(k.raw(`DROP DATABASE ${operationalDatabaseConfig.database};`))

  if (error) {
    if (error.message.includes('does not exist')) {
      console.log(`Operational database '${operationalDatabaseConfig.database}' does not exist.`)
    } else {
      throw error
    }
  } else {
    console.log(`Operational database '${operationalDatabaseConfig.database}' dropped.`)
  }
}
