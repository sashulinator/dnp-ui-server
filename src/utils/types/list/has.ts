import type { Match } from '../any/_internal'
import type { Has as OHas } from '../object/has'
import type { Key } from './_internal'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Check whether `L` has a entry of key `K` that matches `M`
 * @param L to be inspected
 * @param K to choose entry
 * @param M (?=`any`) to check entry type
 * @param match (?=`'default'`) to change precision
 * @returns [[Boolean]]
 * @example
 * ```ts
 * ```
 */
export type Has<L extends List, K extends Key, M extends any = any, match extends Match = 'default'> = OHas<
  ObjectOf<L>,
  `${K & number}` | K,
  M,
  match
>
