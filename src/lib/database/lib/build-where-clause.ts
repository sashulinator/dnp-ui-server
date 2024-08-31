import { type Knex } from 'knex'

import { has } from '~/utils/core'

import { type Where } from '../types/where'

// Функция для построения условий WHERE
export function buildWhereClause(queryBuilder: Knex.QueryBuilder, originalWhere: Where): Knex.QueryBuilder {
  const where = { ...originalWhere }

  if (has(where, 'AND')) {
    if (Array.isArray(where.AND)) {
      const ANDARRAY = where.AND

      ANDARRAY.forEach((where) => {
        queryBuilder.where(function () {
          buildWhereClause(this, where)
        })
      })
    } else {
      queryBuilder.where(function () {
        buildWhereClause(this, where.AND as Where)
      })
    }
    delete where.AND
  }

  // Обработка OR
  if (has(where, 'OR')) {
    for (const orClause of where.OR) {
      queryBuilder.orWhere(function () {
        buildWhereClause(this, orClause)
      })
    }
    delete where.OR
  }

  if (has(where, 'NOT')) {
    if (Array.isArray(where.NOT)) {
      const NOTARRAY = where.NOT
      NOTARRAY.forEach((where) => {
        queryBuilder.whereNot(function () {
          buildWhereClause(this, where)
        })
      })
    } else {
      queryBuilder.whereNot(() => {
        buildWhereClause(this, where.NOT as Where)
      })
    }
    delete where.NOT
  }

  // Обработка одиночных условий
  for (const [columnName, value] of Object.entries(where)) {
    if (typeof value === 'object' && has(value, 'contains')) {
      queryBuilder.where(columnName, 'like', `%${value.contains}%`)
    } else if (typeof value === 'object' && has(value, 'startsWith')) {
      queryBuilder.where(columnName, 'like', `${value.startsWith}%`)
    } else if (typeof value === 'object' && has(value, 'endsWith')) {
      queryBuilder.where(columnName, 'like', `%${value.endsWith}`)
    } else if (typeof value === 'object' && has(value, 'not')) {
      queryBuilder.whereNot(columnName, value.not)
    } else if (typeof value === 'object' && has(value, 'gt')) {
      queryBuilder.where(columnName, '>', value.gt)
    } else if (typeof value === 'object' && has(value, 'gte')) {
      queryBuilder.where(columnName, '>=', value.gte)
    } else if (typeof value === 'object' && has(value, 'lt')) {
      queryBuilder.where(columnName, '<', value.lt)
    } else if (typeof value === 'object' && has(value, 'lte')) {
      queryBuilder.where(columnName, '<=', value.lte)
    } else if (typeof value === 'object' && has(value, 'in')) {
      //   queryBuilder.whereIn(columnName, value.in)
      // } else if (typeof value === 'object' && has(value, 'notIn')) {
      //   queryBuilder.whereNotIn(columnName, value.notIn)
    } else {
      queryBuilder.where(columnName, value)
    }
  }

  return queryBuilder
}
