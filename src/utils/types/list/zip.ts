import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { Next } from '../iteration/next'
import type { Pos } from '../iteration/pos'
import type { Naked } from './_internal'
import type { Append } from './append'
import type { Length } from './length'
import type { List } from './list'

/**
 * @hidden
 */
type __Zip<L extends List, L1 extends List, LN extends List = [], I extends Iteration = IterationOf<0>> = {
  0: __Zip<L, L1, Append<LN, [L[Pos<I>], L1[Pos<I>]]>, Next<I>>
  1: LN
}[Extends<Pos<I>, Length<L>>]

/**
 * @hidden
 */
export type _Zip<L extends List, L1 extends List> = __Zip<Naked<L>, L1> extends infer X ? Cast<X, List> : never

/**
 * Pair up the entries of `L` with `L1`
 * @param L to pair up
 * @param L1 to pair up with
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Zip<L extends List, L1 extends List> = L extends unknown
  ? L1 extends unknown
    ? _Zip<L, L1>
    : never
  : never
