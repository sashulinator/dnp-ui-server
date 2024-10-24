import knex from 'knex'

import { getDatabaseConfigMap } from '../_lib/get-database-config-map'
import { run as runData } from './data/run'
import { run as runDatabase } from './database/run'

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

  await runDatabase(appKnex, databaseConfigMap)
  await runData(appKnex, databaseConfigMap)
}

;(() => {
  emit().then(() => process.exit(0))
})()
