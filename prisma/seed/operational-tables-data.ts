import { operationalStoreConfig } from '../../database/create/data/store-config'
import { type OperationalTable } from '../../src/entities/operational-table/dto'
import { _idColumn } from '../../src/entities/operational-table/models/_id-column'
import { _statusColumn } from '../../src/entities/operational-table/models/_status'
import Database from '../../src/shared/database'
import { operationalTables } from './operational-tables'

export default async function seedOperationalTables() {
  const database = new Database().setConfig({
    client: 'pg',
    host: operationalStoreConfig.data.host,
    port: operationalStoreConfig.data.port,
    username: operationalStoreConfig.data.username,
    password: operationalStoreConfig.data.password,
    dbName: operationalStoreConfig.data.dbName,
  })

  // Employees

  const employeesOt = operationalTables[1] as OperationalTable

  await database.dropTableIfExists(employeesOt.tableName)

  await database.createTable(employeesOt.tableName, [_idColumn, _statusColumn, ...employeesOt.columns])

  const employeesRows = new Array(3).fill(undefined).map((_, i) => {
    return employeesOt.columns.reduce((acc, item) => {
      acc[item.columnName] = `seeded-${item.columnName}-${i}`
      return acc
    }, {})
  })

  const employeesPromises = employeesRows.map((row) => {
    return database.insertRow(employeesOt.tableName, row)
  })

  await Promise.all(employeesPromises)

  // Cars

  const carsOt = operationalTables[0] as OperationalTable

  await database.dropTableIfExists(carsOt.tableName)

  await database.createTable(carsOt.tableName, [_idColumn, _statusColumn, ...carsOt.columns])

  const carsRows = new Array(3).fill(undefined).map((_, i) => {
    return carsOt.columns.reduce((acc, item) => {
      acc[item.columnName] = `seeded-${item.columnName}-${i}`
      return acc
    }, {})
  })

  const carsPromises = carsRows.map((row) => {
    return database.insertRow(carsOt.tableName, row)
  })

  await Promise.all(carsPromises)
}
