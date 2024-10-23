import knex from 'knex'

import { asyncCatchError } from '../_lib/catch-error'
import { getTargetDatabaseConfig } from '../_lib/get-database-config'

export async function dropTargetDatabase() {
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

  const [error] = await asyncCatchError(k.raw(`DROP DATABASE ${targetDatabaseConfig.database};`))

  if (error) {
    if (error.message.includes('does not exist')) {
      console.log(`Target database '${targetDatabaseConfig.database}' does not exist.`)
    } else {
      throw error
    }
  } else {
    console.log(`Target database '${targetDatabaseConfig.database}' dropped.`)
  }
}
