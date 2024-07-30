import type { Match } from '../any/_internal'
import type { IntersectKeys } from './intersect-keys'
import type { Pick } from './pick'

/**
 * Get the intersecting fields of `O` & `O1`
 * (If `match = 'default'`, no type checks are done)
 * @param O to check similarities with
 * @param O1 to check similarities against
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Intersect<O extends object, O1 extends object, match extends Match = 'default'> = Pick<
  O,
  IntersectKeys<O, O1, match>
>
