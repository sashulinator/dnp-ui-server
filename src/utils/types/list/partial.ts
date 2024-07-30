import type { Cast } from '../any/cast'
import type { Depth } from '../object/_internal'
import type { Partial as OPartial } from '../object/partial'
import type { List } from './list'

/**
 * Make all fields of `O` optional (deeply or not)
 * @param L to make optional
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @returns [[List]]
 * @example
 * ```ts
 * import type {O} from 'ts-toolbelt'
 *
 * type L = [1, 2, 3, [4, [5]]]
 *
 * type test0 = O.Partial<L>
 * type test1 = O.Partial<L, 'deep'>
 * ```
 */
export type Partial<L extends List, depth extends Depth = 'flat'> = Cast<OPartial<L, depth>, List>
