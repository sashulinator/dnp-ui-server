import { type Knex } from 'knex'

import { COMPARISON, IN, IS, MATCH } from '~/shared/where'
import { has } from '~/utils/core'
import { BaseError } from '~/utils/error'

import { type BooleanFilter, type IntFilter, type StringFilter, type Where } from '../models/where'

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

    /**
     * match
     */
    if (typeof filter === 'object' && has(filter, MATCH.match)) {
      if (filter.match === null) continue
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, _getLike(filter), filter.match)
      if (filter.notMode) queryBuilder.orWhere(columnName, 'is', null)
    } else if (typeof filter === 'object' && has(filter, MATCH.contains)) {
      if (filter.contains === null) continue
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, _getLike(filter), `%${filter.contains}%`)
      if (filter.notMode) queryBuilder.orWhere(columnName, 'is', null)
    } else if (typeof filter === 'object' && has(filter, MATCH.startsWith)) {
      if (filter.startsWith === null) continue
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, _getLike(filter), `${filter.startsWith}%`)
      if (filter.notMode) queryBuilder.orWhere(columnName, 'is', null)
    } else if (typeof filter === 'object' && has(filter, MATCH.endsWith)) {
      if (filter.endsWith === null) continue
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, _getLike(filter), `%${filter.endsWith}`)
      if (filter.notMode) queryBuilder.orWhere(columnName, 'is', null)

      /**
       * compare
       */
    } else if (typeof filter === 'object' && has(filter, COMPARISON.gt)) {
      if (filter.gt === null) continue
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, '>', filter.gt)
    } else if (typeof filter === 'object' && has(filter, COMPARISON.equals)) {
      if (filter.equals === null) continue
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, '=', filter.equals)
    } else if (typeof filter === 'object' && has(filter, COMPARISON.gte)) {
      if (filter.gte === null) continue
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, '>=', filter.gte)
    } else if (typeof filter === 'object' && has(filter, COMPARISON.lt)) {
      if (filter.lt === null) continue
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, '<', filter.lt)
    } else if (typeof filter === 'object' && has(filter, COMPARISON.lte)) {
      if (filter.lte === null) continue
      queryBuilder[_getWhereOrWhereNot(filter)](columnName, '<=', filter.lte)

      /**
       * in
       */
    } else if (typeof filter === 'object' && has(filter, IN.in)) {
      queryBuilder.whereIn(columnName, filter.in as string[])
    } else if (typeof filter === 'object' && has(filter, IN.notIn)) {
      queryBuilder.whereNotIn(columnName, filter.notIn as string[])

      /**
       * is
       */
    } else if (typeof filter === 'object' && has(filter, IS.is)) {
      queryBuilder.where(columnName, 'is', filter.is as null)
    } else if (typeof filter === 'object' && has(filter, IS.not)) {
      queryBuilder.whereNot(columnName, filter.not)
    } else {
      /**
       * string
       */
      if (typeof filter === 'string' || typeof filter === 'number') {
        queryBuilder.where(columnName, '=', filter)
        return
      }

      // Error
      throw new BaseError('Unknown Filter', { input: filter })
    }
  }

  return queryBuilder
}

/**
 * private
 */

function _getLike(match: { caseSensitive?: boolean }): 'like' | 'ilike' {
  if (match.caseSensitive) return 'like'
  return 'ilike'
}

function _getWhereOrWhereNot(match: { notMode?: boolean }): 'where' | 'whereNot' {
  if (match.notMode) return 'whereNot'
  return 'where'
}
