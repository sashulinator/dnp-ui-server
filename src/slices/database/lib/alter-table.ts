import { type Knex } from 'knex'

import { type Column } from '../models/database'
import { buildColumn } from './build-column'

export function alterTable(knex: Knex, tableName: string, columns: Column[]) {
  return knex.schema.alterTable(tableName, (tableBuilder) => {
    columns.forEach((column) => buildColumn(tableBuilder, column))
  })
}
