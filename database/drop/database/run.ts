import knex, { type Knex } from 'knex'

import { type DatabaseConfigMap } from '../../_lib/get-database-config-map'
import { drop } from './drop'

export async function run(appKnex: Knex, databaseConfigMap: DatabaseConfigMap) {
  const targetKnex = knex({
    client: 'pg',
    connection: {
      host: databaseConfigMap.target.host,
      port: databaseConfigMap.target.port,
      user: databaseConfigMap.target.user,
      password: databaseConfigMap.target.password,
      // Нужной базы данных не существует поэтому подключаемся к postgres
      database: 'postgres',
    },
  })

  await drop(targetKnex, databaseConfigMap.target.database)

  const operationalKnex = knex({
    client: 'pg',
    connection: {
      host: databaseConfigMap.operational.host,
      port: databaseConfigMap.operational.port,
      user: databaseConfigMap.operational.user,
      password: databaseConfigMap.operational.password,
      // Нужной базы данных не существует поэтому подключаемся к postgres
      database: 'postgres',
    },
  })

  await drop(operationalKnex, databaseConfigMap.operational.database)
}
