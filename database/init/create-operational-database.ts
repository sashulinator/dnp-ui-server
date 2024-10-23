import knex from 'knex'

import { asyncCatchError } from '../_lib/catch-error'
import { getOperationalDatabaseConfig } from '../_lib/get-database-config'

export async function createOperationalDatabase() {
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

  const [error] = await asyncCatchError(k.raw(`CREATE DATABASE ${operationalDatabaseConfig.database}`))

  if (error) {
    if (error.message.includes('already exists')) {
      console.log(`Operational database '${operationalDatabaseConfig.database}' already exists`)
    } else {
      throw error
    }
  } else {
    console.log(`Operational database '${operationalDatabaseConfig.database}' created.`)
  }
}
