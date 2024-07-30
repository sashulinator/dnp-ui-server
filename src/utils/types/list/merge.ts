import type { Cast } from '../any/cast'
import type { BuiltIn } from '../misc/builtIn'
import type { Depth } from '../object/_internal'
import type { Merge as OMerge } from '../object/merge'
import type { List } from './list'

/**
 * Accurately merge the fields of `L` with the ones of `L1`. It is
 * equivalent to the spread operator in JavaScript. [[Union]]s and [[Optional]]
 * fields will be handled gracefully.
 *
 * (⚠️ needs `--strictNullChecks` enabled)
 * @param L to complete
 * @param L1 to copy from
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @param ignore (?=`BuiltIn`) types not to merge
 * @param fill (?=`undefined`) types of `O` to be replaced with ones of `O1`
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Merge<
  L extends List,
  L1 extends List,
  depth extends Depth = 'flat',
  ignore extends object = BuiltIn,
  fill extends any = undefined,
> = Cast<OMerge<L, L1, depth, ignore, fill>, List>
