import { type DictionaryTable } from '../../src/entities/dictionary-table/dto'
import { type StoreConfig } from '../../src/entities/store-configs/dto'
import { toDatabasConfig } from '../../src/entities/store-configs/lib/to-database-config'
import Database from '../../src/lib/database'
import rfSubjects from './dictionary-table/rf-subjects'
import countryList from './dictionary-table/seed-list.country'
import userList from './dictionary-table/seed-list.users'
import { dictionaryTables } from './dictionary-tables'
import { storeConfigs } from './store-configs'

export default async function seedDictionaryTables() {
  const storeConfig = storeConfigs[0] as StoreConfig
  const database = new Database().setConfig(toDatabasConfig(storeConfig))

  // countries

  const countriesOt = dictionaryTables[0] as DictionaryTable

  await database.dropTableIfExists(countriesOt.tableName)

  await database.createTable(countriesOt.tableName, {
    items: [...(countriesOt.tableSchema.items as any)],
  })

  const countriesPromises = countryList.map((row) => {
    return database.insertRow(countriesOt.tableName, row)
  })

  await Promise.all(countriesPromises)

  // employees

  const employeesdt = dictionaryTables[1] as DictionaryTable

  await database.dropTableIfExists(employeesdt.tableName)

  await database.createTable(employeesdt.tableName, {
    items: employeesdt.tableSchema.items as any,
  })

  const employeesPromises = userList.map((row) => {
    return database.insertRow(employeesdt.tableName, row)
  })

  await Promise.all(employeesPromises)

  // rfSubject

  const rfSubjectOt = dictionaryTables[2] as DictionaryTable

  await database.dropTableIfExists(rfSubjectOt.tableName)

  await database.createTable(rfSubjectOt.tableName, {
    items: [...(rfSubjectOt.tableSchema.items as any)],
  })

  const rfSubjectPromises = rfSubjects.map((row) => {
    return database.insertRow(rfSubjectOt.tableName, row)
  })

  await Promise.all(rfSubjectPromises)
}
