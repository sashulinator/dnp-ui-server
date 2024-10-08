import { type Knex } from 'knex'

import { type Column } from '../models/database'
import { buildColumn } from './build-column'

export interface AlterTableSchema {
  items: Column[]
}

export function alterTable(knex: Knex, tableName: string, schema: { items: Column[] }) {
  return knex.schema.alterTable(tableName, (tableBuilder) => {
    schema.items.forEach((item) => buildColumn(tableBuilder, item))
  })
}
