import knex from 'knex'

import { getDatabaseConfigMap } from '../_lib/get-database-config-map'
import { run } from './run'

async function emit() {
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

  run(appKnex, databaseConfigMap)
}

;(() => {
  emit().then(() => process.exit(0))
})()
