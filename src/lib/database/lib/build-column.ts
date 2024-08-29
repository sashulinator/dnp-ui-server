import { type Knex } from 'knex'
import { type Any } from '~/utils/core'

export interface BuildColumnProps {
  columnName: string
  type: 'string' | 'number' | 'boolean' | 'increments'
  defaultTo?: Any | undefined
  unique?: boolean
  index?: boolean
  relation?: {
    tableName: string
    columnName: string
  }
}

export function buildColumn(createTableBuilder: Knex.CreateTableBuilder, props: BuildColumnProps) {
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

  if (props.relation) {
    createTableBuilder.foreign(props.columnName).references(props.relation.columnName).inTable(props.relation.tableName)
  }
}
