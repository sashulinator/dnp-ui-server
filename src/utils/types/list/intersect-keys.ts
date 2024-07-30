import type { Match } from '../any/_internal'
import type { IntersectKeys as OIntersectKeys } from '../object/intersect-keys'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get the intersecting entries of `L` & `L1`
 * (If `match = 'default'`, no type checks are done)
 * @param L to check similarities with
 * @param L1 to check similarities against
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
export type IntersectKeys<L extends List, L1 extends List, match extends Match = 'default'> = OIntersectKeys<
  ObjectOf<L>,
  L1,
  match
>
