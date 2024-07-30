import type { Match } from '../any/_internal'
import type { Diff as ODiff } from '../object/diff'
import type { ListOf } from '../object/list-of'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get a [[List]] that is the difference between `L` & `L1`
 * (`L`'s differences have priority over `L1`'s if entries overlap)
 * (If `match = 'default'`, no type checks are done)
 * @param L to check differences with
 * @param L1 to check differences against
 * @param match (?=`'default'`) to change precision
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Diff<L extends List, L1 extends List, match extends Match = 'default'> = ListOf<
  ODiff<ObjectOf<L>, ObjectOf<L1>, match>
>
