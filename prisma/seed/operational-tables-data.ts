import { _idColumn } from '~/entities/operational-table/models/_id-column'
import { _statusColumn } from '~/entities/operational-table/models/_status'

import { type OperationalTable } from '../../src/entities/operational-table/dto'
import { type StoreConfig } from '../../src/entities/store-configs/dto'
import { toDatabasConfig } from '../../src/entities/store-configs/lib/to-database-config'
import Database from '../../src/shared/database'
import { operationalTables } from './operational-tables'
import { storeConfigs } from './store-configs'

export default async function seedOperationalTables() {
  const storeConfig = storeConfigs[0] as StoreConfig
  const database = new Database().setConfig(toDatabasConfig(storeConfig))

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
