import type { Cast } from '../any/cast'
import type { Depth } from '../object/_internal'
import type { RequiredPart } from '../object/required'
import type { List } from './list'

/**
 * Make `L` required (deeply or not)
 * @param L to make required
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Required<L extends List, depth extends Depth = 'flat'> = Cast<RequiredPart<L, depth>, List>
