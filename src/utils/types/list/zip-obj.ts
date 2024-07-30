import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { Key } from '../any/key'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { Next } from '../iteration/next'
import type { Pos } from '../iteration/pos'
import type { PatchFlat } from '../object/patch'
import type { Record } from '../object/record'
import type { Naked } from './_internal'
import type { Length } from './length'
import type { List } from './list'

/**
 * @hidden
 */
type __ZipObj<
  LKeys extends List<Key>,
  LFields extends List,
  O extends object = {},
  I extends Iteration = IterationOf<0>,
> = {
  0: __ZipObj<LKeys, LFields, PatchFlat<O, Record<LKeys[Pos<I>], LFields[Pos<I>]>>, Next<I>>
  1: O
}[Extends<Pos<I>, Length<LKeys>>]

/**
 * @hidden
 */
export type _ZipObj<LKeys extends List<Key>, LFields extends List> = __ZipObj<Naked<LKeys>, LFields> extends infer X
  ? Cast<X, object>
  : never

/**
 * Create an [[Object]] from [[List]]s of keys & fields
 * @param LKeys its keys
 * @param LFields its fields
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type ZipObj<LKeys extends List<Key>, LFields extends List> = LKeys extends unknown
  ? LFields extends unknown
    ? _ZipObj<LKeys, LFields>
    : never
  : never
