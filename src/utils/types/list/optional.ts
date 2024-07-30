import type { Cast } from '../any/cast'
import type { Depth } from '../object/_internal'
import type { OptionalPart } from '../object/optional'
import type { List } from './list'

/**
 * Make `L` optional (deeply or not)
 * @param L to make optional
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Optional<L extends List, depth extends Depth = 'flat'> = Cast<OptionalPart<L, depth>, List>
