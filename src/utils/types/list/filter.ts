import type { Match } from '../any/_internal'
import type { Filter as OFilter } from '../object/filter'
import type { ListOf } from '../object/list-of'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Filter out of `L` the entries that match `M`
 * @param L to remove from
 * @param M to select entries
 * @param match (?=`'default'`) to change precision
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Filter<L extends List, M extends any, match extends Match = 'default'> = ListOf<
  OFilter<ObjectOf<L>, M, match>
>
