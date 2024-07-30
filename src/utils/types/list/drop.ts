import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { Way } from '../iteration/_internal'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { Pos } from '../iteration/pos'
import type { Prev } from '../iteration/prev'
import type { Naked } from './_internal'
import type { List } from './list'
import type { Prepend } from './prepend'
import type { Tail } from './tail'

/**
 * @hidden
 */
type DropForth<L extends List, N extends Iteration> = {
  0: DropForth<Tail<L>, Prev<N>>
  1: L
}[Extends<0, Pos<N>>]

/**
 * @hidden
 */
type DropBack<L extends List, N extends Iteration, I extends Iteration = Prev<N>, LN extends List = []> = {
  0: DropBack<L, N, Prev<I>, Prepend<LN, L[Pos<I>]>>
  1: LN
}[Extends<-1, Pos<I>>]

/**
 * @hidden
 */
type __Drop<L extends List, N extends Iteration, way extends Way> = {
  '->': DropForth<L, N>
  '<-': DropBack<L, N>
}[way]

/**
 * @hidden
 */
export type _Drop<L extends List, N extends number, way extends Way = '->'> = __Drop<
  Naked<L>,
  IterationOf<N>,
  way
> extends infer X
  ? Cast<X, List>
  : never

/**
 * Remove `N` entries out of `L`
 * @param L to remove from
 * @param N to remove out
 * @param way (?=`'->'`) from front: '->', from end: '<-'
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Drop<L extends List, N extends number, way extends Way = '->'> = L extends unknown
  ? N extends unknown
    ? _Drop<L, N, way>
    : never
  : never
