import knex from 'knex'

import { asyncCatchError } from '../_lib/catch-error'
import { getTargetDatabaseConfig } from '../_lib/get-database-config'

export async function createTargetDatabase() {
  const targetDatabaseConfig = getTargetDatabaseConfig()

  const k = knex({
    client: 'pg',
    connection: {
      host: targetDatabaseConfig.host,
      port: targetDatabaseConfig.port,
      user: targetDatabaseConfig.user,
      password: targetDatabaseConfig.password,
      database: 'postgres',
    },
  })

  const [error] = await asyncCatchError(k.raw(`CREATE DATABASE ${targetDatabaseConfig.database}`))

  if (error) {
    if (error.message.includes('already exists')) {
      console.log(`Target database '${targetDatabaseConfig.database}' already exists`)
    } else {
      throw error
    }
  } else {
    console.log(`Target database '${targetDatabaseConfig.database}' created.`)
  }
}
