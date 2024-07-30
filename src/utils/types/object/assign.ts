import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { Next } from '../iteration/next'
import type { Pos } from '../iteration/pos'
import type { Length } from '../list/length'
import type { List } from '../list/list'
import type { BuiltIn } from '../misc/builtIn'
import type { Depth } from './_internal'
import type { Merge } from './merge'

/**
 * @hidden
 */
type __Assign<
  O extends object,
  Os extends List<object>,
  depth extends Depth,
  ignore extends object,
  fill extends any,
  I extends Iteration = IterationOf<0>,
> = {
  0: __Assign<Merge<Os[Pos<I>], O, depth, ignore, fill>, Os, depth, ignore, fill, Next<I>>
  1: O
}[Extends<Pos<I>, Length<Os>>]

/**
 * @hidden
 */
export type _Assign<
  O extends object,
  Os extends List<object>,
  depth extends Depth,
  ignore extends object,
  fill extends any,
> = __Assign<O, Os, depth, ignore, fill> extends infer X ? Cast<X, object> : never

/**
 * Assign a list of [[Object]] into `O` with [[Merge]]. Merges from right to
 * left, first items get overridden by the next ones (last-in overrides).
 * @param O to assign to
 * @param Os to assign
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @param ignore (?=`BuiltIn`) types not to merge
 * @param fill (?=`undefined`) types of `O` to be replaced with ones of `O1`
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Assign<
  O extends object,
  Os extends List<object>,
  depth extends Depth = 'flat',
  ignore extends object = BuiltIn,
  fill extends any = undefined,
> = O extends unknown ? (Os extends unknown ? _Assign<O, Os, depth, ignore, fill> : never) : never
