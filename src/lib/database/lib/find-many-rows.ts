import { type Knex } from 'knex'

import type { Where } from '../types/where'
import { buildWhereClause } from './build-where-clause'

// Метод findMany с параметрами limit, offset, where
export async function findManyRows(
  knex: Knex,
  tableName: string,
  params: {
    limit?: number
    offset?: number
    where?: Where | undefined
    sort?: Record<string, 'asc' | 'desc'> | undefined
  } = {},
): Promise<unknown[]> {
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
