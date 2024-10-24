import {
  countriesDictionaryTable,
  employeesDictionaryTable,
  rfSubjectsDictionaryTable,
} from '../../database/create/data/dictionary-table'
import { targetStoreConfig } from '../../database/create/data/store-config'
import Database from '../../src/shared/database'
import rfSubjects from './dictionary-table/rf-subjects'
import countryList from './dictionary-table/seed-list.country'
import userList from './dictionary-table/seed-list.users'

export default async function seedDictionaryTables() {
  const database = new Database().setConfig({
    client: 'pg',
    host: targetStoreConfig.data.host,
    port: targetStoreConfig.data.port,
    username: targetStoreConfig.data.username,
    password: targetStoreConfig.data.password,
    dbName: targetStoreConfig.data.dbName,
  })

  // countries

  await database.dropTableIfExists(countriesDictionaryTable.tableName)

  await database.createTable(countriesDictionaryTable.tableName, countriesDictionaryTable.columns)

  const countriesPromises = countryList.map((row) => {
    return database.insertRow(countriesDictionaryTable.tableName, row)
  })

  await Promise.all(countriesPromises)

  // employees

  await database.dropTableIfExists(employeesDictionaryTable.tableName)

  await database.createTable(employeesDictionaryTable.tableName, employeesDictionaryTable.columns)

  const employeesPromises = userList.map((row) => {
    return database.insertRow(employeesDictionaryTable.tableName, row)
  })

  await Promise.all(employeesPromises)

  // rfSubject

  await database.dropTableIfExists(rfSubjectsDictionaryTable.tableName)

  await database.createTable(rfSubjectsDictionaryTable.tableName, rfSubjectsDictionaryTable.columns)

  const rfSubjectPromises = rfSubjects.map((row) => {
    return database.insertRow(rfSubjectsDictionaryTable.tableName, row)
  })

  await Promise.all(rfSubjectPromises)
}
