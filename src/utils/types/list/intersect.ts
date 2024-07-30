import type { Match } from '../any/_internal'
import type { Intersect as OIntersect } from '../object/intersect'
import type { ListOf } from '../object/list-of'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get the intersecting entries of `L` & `L1`
 * (If `match = 'default'`, no type checks are done)
 * @param L to check similarities with
 * @param L1 to check similarities against
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Intersect<L extends List, L1 extends List, match extends Match = 'default'> = ListOf<
  OIntersect<ObjectOf<L>, ObjectOf<L1>, match>
>
