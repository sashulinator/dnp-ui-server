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
import type { Patch } from './patch'

/**
 * @hidden
 */
type __PatchAll<
  O extends object,
  Os extends List<object>,
  depth extends Depth,
  ignore extends object,
  fill extends any,
  I extends Iteration = IterationOf<0>,
> = {
  0: __PatchAll<Patch<O, Os[Pos<I>], depth, ignore, fill>, Os, depth, ignore, fill, Next<I>>
  1: O
}[Extends<Pos<I>, Length<Os>>]

/**
 * @hidden
 */
export type _PatchAll<
  O extends object,
  Os extends List<object>,
  depth extends Depth,
  ignore extends object,
  fill extends any,
> = __PatchAll<O, Os, depth, ignore, fill> extends infer X ? Cast<X, object> : never

/**
 * [[Patch]] a list of [[Object]]s into `O`. Patches from left to right, first
 * items get completed by the next ones (last-in completes).
 * @param O to start with
 * @param Os to patch
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @param ignore (?=`BuiltIn`) types not to merge
 * @param fill (?=`never`) types of `O` to be replaced with ones of `O1`
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type PatchAll<
  O extends object,
  Os extends List<object>,
  depth extends Depth = 'flat',
  ignore extends object = BuiltIn,
  fill extends any = never,
> = O extends unknown ? (Os extends unknown ? _PatchAll<O, Os, depth, ignore, fill> : never) : never
