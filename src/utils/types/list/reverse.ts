import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { Next } from '../iteration/next'
import type { Pos } from '../iteration/pos'
import type { Naked } from './_internal'
import type { Length } from './length'
import type { List } from './list'
import type { Prepend } from './prepend'

/**
 * @hidden
 */
type __Reverse<L extends List, LO extends List, I extends Iteration = IterationOf<0>> = {
  0: __Reverse<L, Prepend<LO, L[Pos<I>]>, Next<I>>
  1: LO
}[Extends<Pos<I>, Length<L>>]

/**
 * @hidden
 */
export type _Reverse<L extends List, LO extends List = []> = __Reverse<Naked<L>, LO> extends infer X
  ? Cast<X, List>
  : never

/**
 * Turn a [[List]] the other way around
 * @param L to reverse
 * @param LO (?=`[]`) to prepend to
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Reverse<L extends List> = L extends unknown ? _Reverse<L> : never
