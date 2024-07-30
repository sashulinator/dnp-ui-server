import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { Key } from '../iteration/key'
import type { Next } from '../iteration/next'
import type { Pos } from '../iteration/pos'
import type { Append } from '../list/append'
import type { List } from '../list/list'
import type { Exclude } from '../union/exclude'
import type { Select } from '../union/select'

/**
 * @hidden
 */
type AppendExists<O extends object, LN extends List, I extends Iteration> = Key<I> extends keyof O
  ? Append<LN, O[Key<I>]>
  : Pos<I> extends keyof O
    ? Append<LN, O[Pos<I>]>
    : LN

/**
 * @hidden
 */
type ___ListOf<O extends object, K, LN extends List = [], I extends Iteration = IterationOf<0>> = {
  0: ___ListOf<O, Exclude<K, Key<I>>, AppendExists<O, LN, I>, Next<I>>
  1: LN
}[Extends<[K], [never]>]

/**
 * @hidden
 */
type __ListOf<O extends object> = number extends keyof O
  ? O[number][]
  : string extends keyof O
    ? O[string][]
    : symbol extends keyof O
      ? O[symbol][]
      : ___ListOf<O, Select<keyof O, number | `${number}`>>

/**
 * @hidden
 */
export type _ListOf<O extends object> = __ListOf<O> extends infer X ? Cast<X, List> : never

/**
 * Transform an [[Object]] into a [[List]]
 * (It will only pick numeric literal indexes)
 * @param O to transform
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type ListOf<O extends object> = O extends unknown ? _ListOf<O> : never
