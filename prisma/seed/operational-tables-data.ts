import { type OperationalTable } from '../../src/entities/operational-table/dto'
import { toDatabaseBuildColumnProps } from '../../src/entities/operational-table/lib/to-database-build-column-props'
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

  await database.createTable(employeesOt.tableName, {
    items: [
      { columnName: '_id', type: 'increments' },
      { columnName: '_status', type: 'string', defaultTo: '0' },
      ...employeesOt.tableSchema.items.map(toDatabaseBuildColumnProps),
    ],
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

  const carsOt = operationalTables[0] as OperationalTable

  await database.dropTableIfExists(carsOt.tableName)

  await database.createTable(carsOt.tableName, {
    items: [
      { columnName: '_id', type: 'increments' },
      { columnName: '_status', type: 'string', defaultTo: '0' },
      ...carsOt.tableSchema.items.map(toDatabaseBuildColumnProps),
    ],
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
