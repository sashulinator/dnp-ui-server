import { type Knex } from 'knex'
import { type BuildColumnProps, buildColumn } from './build-column'

export interface CreateTableSchema {
  items: BuildColumnProps[]
}

export function createTable(knex: Knex, tableName: string, schema: { items: BuildColumnProps[] }) {
  return knex.schema.createTable(tableName, (tableBuilder) => {
    schema.items.forEach((item) => buildColumn(tableBuilder, item))
  })
}
