import type { Match } from '../any/_internal'
import type { Exclude as OExclude } from '../object/exclude'
import type { ListOf } from '../object/list-of'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Exclude the entries of `L1` out of `L`
 * (If `match = 'default'`, no type checks are done)
 * @param L to remove from
 * @param L1 to remove out
 * @param match (?=`'default'`) to change precision
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Exclude<L extends List, L1 extends List, match extends Match = 'default'> = ListOf<
  OExclude<ObjectOf<L>, ObjectOf<L1>, match>
>
