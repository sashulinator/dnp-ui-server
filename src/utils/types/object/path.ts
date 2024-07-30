import type { At } from '../any/at'
import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { Key } from '../any/key'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { Next } from '../iteration/next'
import type { Pos } from '../iteration/pos'
import type { Length } from '../list/length'
import type { List } from '../list/list'

/**
 * @ignore
 */
type _Path<O, P extends List<Key>, I extends Iteration = IterationOf<0>> = {
  0: _Path<At<O, P[Pos<I>]>, P, Next<I>>
  1: O
}[Extends<Pos<I>, Length<P>>]

/**
 * Get in `O` the type of nested properties
 * @param O to be inspected
 * @param Path to be followed
 * @returns [[Any]]
 * @example
 * ```ts
 * ```
 */
export type Path<O extends any, P extends List<Key>> = _Path<O & {}, P> extends infer X ? Cast<X, any> : never
