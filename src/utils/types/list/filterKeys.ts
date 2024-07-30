import type { Match } from '../any/_internal'
import type { FilterKeys as OFilterKeys } from '../object/filter-keys'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Filter out the keys of `L` which entries match `M`
 * @param L to remove from
 * @param M to select entries
 * @param match (?=`'default'`) to change precision
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
export type FilterKeys<L extends List, M extends any, match extends Match = 'default'> = OFilterKeys<
  ObjectOf<L>,
  M,
  match
>
