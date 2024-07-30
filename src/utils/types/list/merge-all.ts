import type { Cast } from '../any/cast'
import type { BuiltIn } from '../misc/builtIn'
import type { Depth } from '../object/_internal'
import type { MergeAll as OMergeAll } from '../object/merge-all'
import type { List } from './list'

/**
 * [[Merge]] a list of [[List]]s into `L`. Merges from left to right, first
 * items get completed by the next ones (last-in completes).
 * @param L to start with
 * @param Ls to merge
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @param ignore (?=`BuiltIn`) types not to merge
 * @param fill (?=`undefined`) types of `O` to be replaced with ones of `O1`
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type MergeAll<
  L extends List,
  Ls extends List<List>,
  depth extends Depth = 'flat',
  ignore extends object = BuiltIn,
  fill extends any = undefined,
> = Cast<OMergeAll<L, Ls, depth, ignore, fill>, List>
