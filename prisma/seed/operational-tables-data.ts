import { operationalStoreConfig } from '../../database/seeds/store-config'
import { type OperationalTable } from '../../src/entities/operational-table/dto'
import { _idColumn } from '../../src/entities/operational-table/models/_id-column'
import { _statusColumn } from '../../src/entities/operational-table/models/_status'
import Database from '../../src/slices/database'
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

  await database.dropTableIfExists(employeesOt.name)

  await database.createTable(employeesOt.name, [
    ...employeesOt.columns.map((item) => {
      return { name: item.name, type: 'string', index: Boolean(item.index) } as const
    }),
    _idColumn,
    _statusColumn,
  ])

  const employeesRows = new Array(3).fill(undefined).map((_, i) => {
    return employeesOt.columns.reduce((acc, item) => {
      acc[item.name] = `seeded-${item.name}-${i}`
      return acc
    }, {})
  })

  const employeesPromises = employeesRows.map((row) => {
    return database.insertRow(employeesOt.name, row)
  })

  await Promise.all(employeesPromises)

  // Cars

  const carsOt = operationalTables[0] as OperationalTable

  await database.dropTableIfExists(carsOt.name)

  await database.createTable(carsOt.name, [
    ...carsOt.columns.map((item) => {
      return { name: item.name, type: 'string', index: Boolean(item.index) } as const
    }),
    _idColumn,
    _statusColumn,
  ])

  const carsRows = new Array(3).fill(undefined).map((_, i) => {
    return carsOt.columns.reduce((acc, item) => {
      acc[item.name] = `seeded-${item.name}-${i}`
      return acc
    }, {})
  })

  const carsPromises = carsRows.map((row) => {
    return database.insertRow(carsOt.name, row)
  })

  await Promise.all(carsPromises)

  // Med

  // @ts-ignore
  const medOt = operationalTables[3] as OperationalTable

  await database.dropTableIfExists(medOt.name)

  await database.createTable(medOt.name, [
    ...medOt.columns.map((item) => {
      if (item.name === 'price') {
        return {
          name: item.name,
          type: 'integer',
          isNegativeAllowed: Boolean(item.index),
          index: Boolean(item.index),
        } as const
      } else {
        return { name: item.name, type: 'string', index: Boolean(item.index) } as const
      }
    }),
    _idColumn,
    _statusColumn,
  ])

  const medRows = new Array(3).fill(undefined).map((_, i) => {
    return medOt.columns.reduce((acc, item) => {
      if (item.name === 'price') {
        acc[item.name] = 1 + i
      } else acc[item.name] = `seeded-${item.name}-${i}`
      return acc
    }, {})
  })

  const medPromises = medRows.map((row) => {
    return database.insertRow(medOt.name, row)
  })

  await Promise.all(medPromises)

  // Демо

  const datasetOt = operationalTables[2] as OperationalTable

  await database.dropTableIfExists(datasetOt.name)

  await database.createTable(datasetOt.name, [_idColumn, _statusColumn, ...datasetOt.columns])
}
