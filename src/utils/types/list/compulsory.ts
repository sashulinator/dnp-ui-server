import type { Cast } from '../any/cast'
import type { Depth } from '../object/_internal'
import type { CompulsoryPart } from '../object/compulsory'
import type { _Pick } from '../object/pick'
import type { List } from './list'

/**
 * Make that `L`'s fields cannot be [[Nullable]] or [[Optional]] (it's like
 * [[Required]] & [[NonNullable]] at once).
 * @param L to make compulsory
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @returns [[List]]
 * @example
 * ```ts
 *  * import type {L} from 'ts-toolbelt'
 *
 * type test0 = L.Compulsory<[1, 2, 3?, 4?]> // [1, 2, 3, 4]
 * type test1 = L.Compulsory<['a', 'b' | undefined, 'c', 'd', 'e' | null]> // ['a', 'b', 'c', 'd', 'e']
 * ```
 */
export type Compulsory<L extends List, depth extends Depth = 'flat'> = Cast<CompulsoryPart<L, depth>, List>
