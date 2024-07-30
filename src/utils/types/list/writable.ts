import type { Cast } from '../any/cast'
import type { Depth } from '../object/_internal'
import type { WritablePart } from '../object/writable'
import type { List } from './list'

/**
 * Make `L` writable (deeply or not)
 * @param L to make writable
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Writable<L extends List, depth extends Depth = 'flat'> = Cast<WritablePart<L, depth>, List>
