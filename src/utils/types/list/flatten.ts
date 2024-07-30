import type { Cast } from '../any/cast'
import type { Equals } from '../any/equals'
import type { Extends } from '../any/extends'
import type { Boolean } from '../boolean/_internal'
import type { Or } from '../boolean/or'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { Next } from '../iteration/next'
import type { List } from './list'
import type { _UnNest } from './un-nest'

/**
 * @hidden
 */
type __Flatten<
  L extends List,
  LO extends List,
  strict extends Boolean,
  limit extends Iteration,
  I extends Iteration = IterationOf<0>,
> = {
  0: __Flatten<_UnNest<L, strict>, L, strict, limit, Next<I>>
  1: L
}[Or<Equals<L, LO>, Extends<limit, I>>]

/**
 * @hidden
 */
export type _Flatten<L extends List, strict extends Boolean, limit extends number = number> = __Flatten<
  L,
  [],
  strict,
  IterationOf<limit>
> extends infer X
  ? Cast<X, List>
  : never

/**
 * Remove all dimensions of `L` (10 max)
 * @param L to un-nest
 * @param strict (?=`1`) `0` to not preserve tuples
 * @param limit (?=`string`) to stop un-nesting at
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Flatten<L extends List, strict extends Boolean = 1, limit extends number = number> = L extends unknown
  ? _Flatten<L, strict, limit>
  : never
