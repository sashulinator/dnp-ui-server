import { type Knex } from 'knex'

import { type Column } from '../models/database'

export function buildColumn(createTableBuilder: Knex.CreateTableBuilder, props: Column) {
  const columnBuilder = createTableBuilder[props.type](props.columnName) as Knex.ColumnBuilder

  if (props.defaultTo) {
    columnBuilder.defaultTo(props.defaultTo)
  }

  if (props.unique) {
    columnBuilder.unique()
  }

  if (props.index) {
    columnBuilder.index()
  }

  if (props.primary) {
    columnBuilder.primary()
  }

  if (props.relation) {
    createTableBuilder.foreign(props.columnName).references(props.relation.columnName).inTable(props.relation.tableName)
  }
}
