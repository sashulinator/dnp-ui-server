import { type Knex } from 'knex'

import { type Column } from '../models/database'
import { buildColumn } from './build-column'

export interface CreateTableSchema {
  items: Column[]
}

export function createTable(knex: Knex, tableName: string, schema: { items: Column[] }) {
  return knex.schema.createTable(tableName, (tableBuilder) => {
    schema.items.forEach((item) => buildColumn(tableBuilder, item))
  })
}
