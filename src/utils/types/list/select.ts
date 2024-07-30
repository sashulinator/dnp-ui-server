import type { Match } from '../any/_internal'
import type { ListOf } from '../object/list-of'
import type { Select as OSelect } from '../object/select'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Extract the entries of `L` that match `M`
 * @param L to extract from
 * @param M to select entries
 * @param match (?=`'default'`) to change precision
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Select<L extends List, M extends any, match extends Match = 'default'> = ListOf<
  OSelect<ObjectOf<L>, M, match>
>
