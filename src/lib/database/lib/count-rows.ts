import { type Knex } from 'knex'

import { type Where } from '../types/where'
import { buildWhereClause } from './build-where-clause'

export type CountRowsParams = { where?: Where }

export default async function count(knex: Knex, tableName: string, params: CountRowsParams = {}): Promise<number> {
  const { where } = params
  const queryBuilder = knex<unknown, { count: string }>(tableName)

  // Добавляем условие WHERE
  if (where) {
    // Преобразуем объект where в условия knex
    buildWhereClause(queryBuilder, where)
  }

  queryBuilder.count('*').first()

  const ret = await queryBuilder

  return parseInt(ret.count)
}
