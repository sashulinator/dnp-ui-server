import type { Match } from '../any/_internal'
import type { ExcludeKeys as OExcludeKeys } from '../object/exclude-keys'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Exclude the keys of `L1` out of the keys of `L`
 * (If `match = 'default'`, no type checks are done)
 * @param L to remove the keys from
 * @param L1 to remove the keys out
 * @param match (?=`'default'`) to change precision
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
export type ExcludeKeys<L extends List, L1 extends List, match extends Match = 'default'> = OExcludeKeys<
  ObjectOf<L>,
  ObjectOf<L1>,
  match
>
