import { type Knex } from 'knex'

import type { Where } from '../types/where'
import { buildWhereClause } from './build-where-clause'

// Метод findMany с параметрами limit, offset, where
export async function findManyRows(
  knex: Knex,
  tableName: string,
  params: { limit?: number; offset?: number; where?: Where | undefined } = {},
): Promise<unknown[]> {
  const { limit, offset, where } = params
  let queryBuilder = knex(tableName)

  // Добавляем ограничения (limit, offset)
  if (limit) {
    queryBuilder.limit(limit)
  }
  if (offset) {
    queryBuilder.offset(offset)
  }

  // Добавляем условие WHERE
  if (where) {
    // Преобразуем объект where в условия knex
    queryBuilder = buildWhereClause(queryBuilder, where)
  }

  const ret = await queryBuilder

  return ret
}
