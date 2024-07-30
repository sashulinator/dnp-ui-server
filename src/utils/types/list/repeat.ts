import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { Next } from '../iteration/next'
import type { Pos } from '../iteration/pos'
import type { List } from './list'
import type { Prepend } from './prepend'

/**
 * @hidden
 */
type __Repeat<N extends number, A, L extends List = [], I extends Iteration = IterationOf<0>> = {
  0: __Repeat<N, A, Prepend<L, A>, Next<I>>
  1: L
}[Extends<Pos<I>, N>]

/**
 * @hidden
 */
export type _Repeat<A extends any, N extends number, L extends List = []> = __Repeat<N, A, L> extends infer X
  ? Cast<X, List>
  : never

/**
 * Fill a [[List]] with `N` times `A`
 * @param A to fill with
 * @param N to repeat it
 * @param L (?=`[]`) to be filled
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Repeat<A extends any, N extends number, L extends List = []> = N extends unknown
  ? L extends unknown
    ? _Repeat<A, N, L>
    : never
  : never
