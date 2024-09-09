import { storeConfigs } from './store-configs'
import { dictionaryTables } from './dictionary-tables'
import { type StoreConfig } from '../../src/entities/store-configs/dto'
import { type DictionaryTable } from '../../src/entities/dictionary-table/dto'
import Database from '../../src/lib/database'
import { toDatabasConfig } from '../../src/entities/store-configs/lib/to-database-config'

export default async function seedDictionaryTables() {
  const storeConfig = storeConfigs[0] as StoreConfig
  const database = new Database().setConfig(toDatabasConfig(storeConfig))

  // Employees

  const employeesOt = dictionaryTables[1] as DictionaryTable

  await database.dropTableIfExists(employeesOt.tableName)

  await database.createTable(employeesOt.tableName, {
    items: [
      { columnName: '_id', type: 'increments' },
      { columnName: '_status', type: 'string', defaultTo: '0' },
      ...employeesOt.tableSchema.items as any],
  })

  const employeesRows = new Array(3).fill(undefined).map((_, i) => {
    return employeesOt.tableSchema.items.reduce((acc, item) => {
      acc[item.columnName] = `seeded-${item.columnName}-${i}`
      return acc
    }, {})
  })

  const employeesPromises = employeesRows.map((row) => {
    return database.insertRow(employeesOt.tableName, row)
  })

  await Promise.all(employeesPromises)

  // Cars

  const carsOt = dictionaryTables[0] as DictionaryTable

  await database.dropTableIfExists(carsOt.tableName)

  await database.createTable(carsOt.tableName, {
    items: [
      { columnName: '_id', type: 'increments' },
      { columnName: '_status', type: 'string', defaultTo: '0' },
      ...carsOt.tableSchema.items as any],
  })

  const carsRows = new Array(3).fill(undefined).map((_, i) => {
    return carsOt.tableSchema.items.reduce((acc, item) => {
      acc[item.columnName] = `seeded-${item.columnName}-${i}`
      return acc
    }, {})
  })

  const carsPromises = carsRows.map((row) => {
    return database.insertRow(carsOt.tableName, row)
  })

  await Promise.all(carsPromises)
}
