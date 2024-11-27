import { type Knex } from 'knex'

import { countriesDictionaryTable, employeesDictionaryTable, rfSubjectsDictionaryTable } from './dictionary-table'
import { countriesRawTable, employeesRawTable, rfSubjectsRawTable } from './raw-table'
import { operationalStoreConfig, targetStoreConfig } from './store-config'
import { systemUser } from './users'

export async function run(appKnex: Knex) {
  // User

  await insert(appKnex, 'public', 'User', systemUser, ['id'])

  // DictionaryTable

  await Promise.all(
    [countriesDictionaryTable, employeesDictionaryTable, rfSubjectsDictionaryTable].map((data) =>
      insert(appKnex, 'storeContainer', 'DictionaryTable', { ...data, columns: JSON.stringify(data.columns) }, ['kn']),
    ),
  )

  // RawTable aka RawTable

  await Promise.all(
    [countriesRawTable, employeesRawTable, rfSubjectsRawTable].map((data) =>
      insert(appKnex, 'storeContainer', 'RawTable', { ...data, columns: JSON.stringify(data.columns) }, ['kn']),
    ),
  )

  // StoreConfig

  await Promise.all(
    [operationalStoreConfig, targetStoreConfig].map((data) =>
      insert(appKnex, 'storeContainer', 'StoreConfig', { ...data, data: JSON.stringify(data.data) }, ['kn']),
    ),
  )
}

async function insert(appKnex: Knex, schemaName: string, tableName: string, data: any, conflict: string[]) {
  await appKnex(tableName).withSchema(schemaName).insert(data).onConflict(conflict).merge()
  console.log(`${tableName} with ${conflict[0]} '${data[conflict[0]]}' upserted.`)
}
