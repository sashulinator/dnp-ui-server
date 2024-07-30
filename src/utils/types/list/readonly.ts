import type { Cast } from '../any/cast'
import type { Depth } from '../object/_internal'
import type { ReadonlyPart } from '../object/readonly'
import type { List } from './list'

/**
 * Make `L` readonly (deeply or not)
 * @param L to make readonly
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Readonly<L extends List, depth extends Depth = 'flat'> = Cast<ReadonlyPart<L, depth>, List>
