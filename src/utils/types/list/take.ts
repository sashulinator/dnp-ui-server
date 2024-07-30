import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { Way } from '../iteration/_internal'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { Pos } from '../iteration/pos'
import type { Prev } from '../iteration/prev'
import type { List } from './list'
import type { Prepend } from './prepend'
import type { Tail } from './tail'

/**
 * starts in reverse from `N` till `N` = 0
 * @hidden
 */
type TakeForth<L extends List, N extends Iteration, I extends Iteration = Prev<N>, LN extends List = []> = {
  0: TakeForth<L, N, Prev<I>, Prepend<LN, L[Pos<I>]>>
  1: LN
}[Extends<-1, Pos<I>>]

/**
 * starts in reverse from the end till `N` = 0
 * @hidden
 */
type TakeBack<L extends List, N extends Iteration> = {
  0: TakeBack<Tail<L>, Prev<N>>
  1: L
}[Extends<0, Pos<N>>]

/**
 * @hidden
 */
type __Take<L extends List, N extends Iteration, way extends Way> = {
  '->': TakeForth<L, N> // Reverse logic to work naturally #`Prepend`
  '<-': TakeBack<L, N> // Reverse logic to work naturally #`Prepend`
}[way]

/**
 * @hidden
 */
export type _Take<L extends List, N extends number, way extends Way = '->'> = __Take<
  L,
  IterationOf<N>,
  way
> extends infer X
  ? Cast<X, List>
  : never

/**
 * Extract `N` entries out of `L`
 * @param L to extract from
 * @param N to extract out
 * @param way (?=`'->'`) to extract from end
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Take<L extends List, N extends number, way extends Way = '->'> = L extends unknown
  ? N extends unknown
    ? _Take<L, N, way>
    : never
  : never
