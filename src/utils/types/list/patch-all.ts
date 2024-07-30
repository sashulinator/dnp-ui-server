import type { Cast } from '../any/cast'
import type { BuiltIn } from '../misc/builtIn'
import type { Depth } from '../object/_internal'
import type { PatchAll as OPatchAll } from '../object/patchAll'
import type { List } from './list'

/**
 * [[Patch]] a list of [[List]]s into `L`. Patches from left to right, first
 * items get completed by the next ones (last-in completes).
 * @param O to start with
 * @param Os to patch
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @param ignore (?=`BuiltIn`) types not to merge
 * @param fill (?=`never`) types of `O` to be replaced with ones of `O1`
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type PatchAll<
  O extends List,
  Ls extends List<List>,
  depth extends Depth = 'flat',
  ignore extends object = BuiltIn,
  fill extends any = never,
> = Cast<OPatchAll<O, Ls, depth, ignore, fill>, List>
