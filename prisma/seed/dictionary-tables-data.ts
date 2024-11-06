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

  await database.dropTableIfExists(countriesDictionaryTable.name)

  await database.createTable(countriesDictionaryTable.name, countriesDictionaryTable.columns)

  const countriesPromises = countryList.map((row) => {
    return database.insertRow(countriesDictionaryTable.name, row)
  })

  await Promise.all(countriesPromises)

  // employees

  await database.dropTableIfExists(employeesDictionaryTable.name)

  await database.createTable(employeesDictionaryTable.name, employeesDictionaryTable.columns)

  const employeesPromises = userList.map((row) => {
    return database.insertRow(employeesDictionaryTable.name, row)
  })

  await Promise.all(employeesPromises)

  // rfSubject

  await database.dropTableIfExists(rfSubjectsDictionaryTable.name)

  await database.createTable(rfSubjectsDictionaryTable.name, rfSubjectsDictionaryTable.columns)

  const rfSubjectPromises = rfSubjects.map((row) => {
    return database.insertRow(rfSubjectsDictionaryTable.name, row)
  })

  await Promise.all(rfSubjectPromises)
}
