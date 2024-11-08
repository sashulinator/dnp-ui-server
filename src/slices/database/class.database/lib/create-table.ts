import { type Knex } from 'knex'

import { type Column } from '../../models'
import { buildColumn } from './build-column'

export function createTable(knex: Knex, tableName: string, columns: Column[]) {
  return knex.schema.createTable(tableName, (tableBuilder) => {
    columns.forEach((column) => buildColumn(tableBuilder, column))
  })
}
