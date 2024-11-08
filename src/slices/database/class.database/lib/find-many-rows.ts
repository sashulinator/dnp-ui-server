import { type Knex } from 'knex'

import type { Sort, Where } from '../../models'
import { buildWhereClause } from './build-where-clause'

export type FindManyRowsParams = {
  limit?: number | undefined
  offset?: number | undefined
  where?: Where | undefined
  sort?: Sort | undefined
}

// Метод findMany с параметрами limit, offset, where
export async function findManyRows(knex: Knex, tableName: string, params: FindManyRowsParams = {}): Promise<unknown[]> {
  const { limit, offset, where, sort } = params
  let queryBuilder = knex(tableName)

  if (limit) {
    queryBuilder.limit(limit)
  }
  if (offset) {
    queryBuilder.offset(offset)
  }
  if (where) {
    // Преобразуем объект where в условия knex
    queryBuilder = buildWhereClause(queryBuilder, where)
  }
  if (sort) {
    Object.entries(sort).forEach(([columnName, order]) => {
      queryBuilder = queryBuilder.orderBy(columnName, order)
    })
  }

  const ret = await queryBuilder

  return ret
}
