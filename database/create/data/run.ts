import { type Knex } from 'knex'

import { type DatabaseConfigMap } from '../../_lib/get-database-config-map'
import { countriesDictionaryTable, employeesDictionaryTable, rfSubjectsDictionaryTable } from './dictionary-table'
import { operationalStoreConfig, targetStoreConfig } from './store-config'
import { systemUser } from './users'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function run(appKnex: Knex, databaseConfigMap: DatabaseConfigMap) {
  // User

  await insert(appKnex, 'User', systemUser, ['id'])

  // DictionaryTable

  await Promise.all(
    [countriesDictionaryTable, employeesDictionaryTable, rfSubjectsDictionaryTable].map((data) =>
      insert(appKnex, 'DictionaryTable', { ...data, columns: JSON.stringify(data.columns) }, ['kn']),
    ),
  )

  // StoreConfig

  await Promise.all(
    [operationalStoreConfig, targetStoreConfig].map((data) =>
      insert(appKnex, 'StoreConfig', { ...data, data: JSON.stringify(data.data) }, ['kn']),
    ),
  )
}

async function insert(appKnex: Knex, tableName: string, data: any, conflict: string[]) {
  await appKnex(tableName).insert(data).onConflict(conflict).merge()
  console.log(`${tableName} with ${conflict[0]} '${data[conflict[0]]}' upserted.`)
}
