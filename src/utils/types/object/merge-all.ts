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
type __MergeAll<
  O extends object,
  Os extends List<object>,
  depth extends Depth,
  ignore extends object,
  fill extends any,
  I extends Iteration = IterationOf<0>,
> = {
  0: __MergeAll<Merge<O, Os[Pos<I>], depth, ignore, fill>, Os, depth, ignore, fill, Next<I>>
  1: O
}[Extends<Pos<I>, Length<Os>>]

/**
 * @hidden
 */
export type _MergeAll<
  O extends object,
  Os extends List<object>,
  depth extends Depth,
  ignore extends object,
  fill extends any,
> = __MergeAll<O, Os, depth, ignore, fill> extends infer X ? Cast<X, object> : never

/**
 * [[Merge]] a list of [[Object]]s into `O`. Merges from left to right, first
 * items get completed by the next ones (last-in completes).
 * @param O to start with
 * @param Os to merge
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @param ignore (?=`BuiltIn`) types not to merge
 * @param fill (?=`undefined`) types of `O` to be replaced with ones of `O1`
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type MergeAll<
  O extends object,
  Os extends List<object>,
  depth extends Depth = 'flat',
  ignore extends object = BuiltIn,
  fill extends any = undefined,
> = O extends unknown ? (Os extends unknown ? _MergeAll<O, Os, depth, ignore, fill> : never) : never
