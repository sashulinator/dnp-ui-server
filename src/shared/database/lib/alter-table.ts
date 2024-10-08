import { type Knex } from 'knex'

import { type BuildColumnProps, buildColumn } from './build-column'

export interface AlterTableSchema {
  items: BuildColumnProps[]
}

export function alterTable(knex: Knex, tableName: string, schema: { items: BuildColumnProps[] }) {
  return knex.schema.alterTable(tableName, (tableBuilder) => {
    schema.items.forEach((item) => buildColumn(tableBuilder, item))
  })
}
