import { type Knex } from 'knex'

import { has } from '~/utils/core'
import { BaseError } from '~/utils/error'

import { type BooleanFilter, type IntFilter, type StringFilter, type Where } from '../types/where'

// Функция для построения условий WHERE
export function buildWhereClause(queryBuilder: Knex.QueryBuilder, where: Where): Knex.QueryBuilder {
  const clonedWhere = { ...where }

  if (has(clonedWhere, 'AND')) {
    if (Array.isArray(clonedWhere.AND)) {
      const ANDARRAY = clonedWhere.AND

      ANDARRAY.forEach((where) => {
        queryBuilder.where(function () {
          buildWhereClause(this, where)
        })
      })
    } else {
      queryBuilder.where(function () {
        buildWhereClause(this, clonedWhere.AND as Where)
      })
    }
    delete clonedWhere.AND
  }

  // Обработка OR
  if (has(clonedWhere, 'OR')) {
    for (const orClause of clonedWhere.OR) {
      queryBuilder.orWhere(function () {
        buildWhereClause(this, orClause)
      })
    }
    delete clonedWhere.OR
  }

  if (has(clonedWhere, 'NOT')) {
    if (Array.isArray(clonedWhere.NOT)) {
      const NOTARRAY = clonedWhere.NOT
      NOTARRAY.forEach((where) => {
        queryBuilder.whereNot(function () {
          buildWhereClause(this, where)
        })
      })
    } else {
      queryBuilder.whereNot(function () {
        buildWhereClause(this, clonedWhere.NOT as Where)
      })
    }
    delete clonedWhere.NOT
  }

  // Обработка одиночных условий
  for (const [columnName, value] of Object.entries(clonedWhere)) {
    const filter = value as StringFilter | IntFilter | BooleanFilter

    // Match
    if (typeof filter === 'object' && has(filter, 'match')) {
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, _getLike(filter), filter.match as string)
    } else if (typeof filter === 'object' && has(filter, 'contains')) {
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, _getLike(filter), `%${filter.contains}%`)
    } else if (typeof filter === 'object' && has(filter, 'startsWith')) {
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, _getLike(filter), `${filter.startsWith}%`)
    } else if (typeof filter === 'object' && has(filter, 'endsWith')) {
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, _getLike(filter), `%${filter.endsWith}`)
      // Compare
    } else if (typeof filter === 'object' && has(filter, 'gt')) {
      queryBuilder.where(columnName, '>', filter.gt)
    } else if (typeof filter === 'object' && has(filter, 'equals')) {
      queryBuilder.where(columnName, '=', filter.equals)
    } else if (typeof filter === 'object' && has(filter, 'gte')) {
      queryBuilder.where(columnName, '>=', filter.gte)
    } else if (typeof filter === 'object' && has(filter, 'lt')) {
      queryBuilder.where(columnName, '<', filter.lt)
    } else if (typeof filter === 'object' && has(filter, 'lte')) {
      queryBuilder.where(columnName, '<=', filter.lte)
      // In
    } else if (typeof filter === 'object' && has(filter, 'in')) {
      queryBuilder.whereIn(columnName, filter.in as string[])
    } else if (typeof filter === 'object' && has(filter, 'notIn')) {
      queryBuilder.whereNotIn(columnName, filter.notIn as string[])
      // is
    } else if (typeof filter === 'object' && has(filter, 'is')) {
      queryBuilder.where(columnName, 'is', filter.is as null)
    } else if (typeof filter === 'object' && has(filter, 'not')) {
      queryBuilder.whereNot(columnName, filter.not)
    } else {
      if (typeof filter === 'string') {
        queryBuilder.where(columnName, 'ilike', `${filter}%`)
        return
      }

      // Error
      throw new BaseError('Unknown Filter', { input: filter })
    }
  }

  return queryBuilder
}

function _getLike(match: { caseSensitive?: boolean }): 'like' | 'ilike' {
  if (match.caseSensitive) return 'like'
  return 'ilike'
}

function _getWhereOrWhereNot(match: { not?: boolean }): 'where' | 'whereNot' {
  if (match.not) return 'where'
  return 'whereNot'
}
