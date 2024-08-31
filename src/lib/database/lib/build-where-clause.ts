import { type Knex } from 'knex'

import { has } from '~/utils/core'

import { type Where } from '../types/where'

// Функция для построения условий WHERE
export function buildWhereClause(queryBuilder: Knex.QueryBuilder, originalWhere: Where): Knex.QueryBuilder {
  const where = { ...originalWhere }

  if (has(where, 'AND')) {
    if (Array.isArray(where.AND)) {
      const ANDARRAY = where.AND
      queryBuilder = queryBuilder.where((builder) => {
        ANDARRAY.forEach((where) => buildWhereClause(builder, where))
      })
    } else {
      queryBuilder = queryBuilder.where((builder) => buildWhereClause(builder, where.AND as Where))
    }
    delete where.AND
  }

  // Обработка OR
  if (has(where, 'OR')) {
    for (const orClause of where.OR) {
      queryBuilder = queryBuilder.orWhere((builder) => buildWhereClause(builder, orClause))
    }
    delete where.OR
  }

  if (has(where, 'NOT')) {
    if (Array.isArray(where.NOT)) {
      const NOTARRAY = where.NOT
      queryBuilder = queryBuilder.whereNot((builder) => {
        NOTARRAY.forEach((where) => buildWhereClause(builder, where))
      })
    } else {
      queryBuilder = queryBuilder.whereNot((builder) => buildWhereClause(builder, where.NOT as Where))
    }
    delete where.NOT
  }

  // Обработка одиночных условий
  for (const [columnName, value] of Object.entries(where)) {
    if (typeof value === 'object' && has(value, 'contains')) {
      queryBuilder = queryBuilder.where(columnName, 'like', `%${value.contains}%`)
    } else if (typeof value === 'object' && has(value, 'startsWith')) {
      queryBuilder = queryBuilder.where(columnName, 'like', `${value.startsWith}%`)
    } else if (typeof value === 'object' && has(value, 'endsWith')) {
      queryBuilder = queryBuilder.where(columnName, 'like', `%${value.endsWith}`)
    } else if (typeof value === 'object' && has(value, 'not')) {
      queryBuilder = queryBuilder.whereNot(columnName, value.not)
    } else if (typeof value === 'object' && has(value, 'gt')) {
      queryBuilder = queryBuilder.where(columnName, '>', value.gt)
    } else if (typeof value === 'object' && has(value, 'gte')) {
      queryBuilder = queryBuilder.where(columnName, '>=', value.gte)
    } else if (typeof value === 'object' && has(value, 'lt')) {
      queryBuilder = queryBuilder.where(columnName, '<', value.lt)
    } else if (typeof value === 'object' && has(value, 'lte')) {
      queryBuilder = queryBuilder.where(columnName, '<=', value.lte)
    } else if (typeof value === 'object' && has(value, 'in')) {
      //   queryBuilder = queryBuilder.whereIn(columnName, value.in)
      // } else if (typeof value === 'object' && has(value, 'notIn')) {
      //   queryBuilder = queryBuilder.whereNotIn(columnName, value.notIn)
    } else {
      queryBuilder = queryBuilder.where(columnName, value)
    }
  }

  return queryBuilder
}
