import type { Depth } from './_internal'
import type { OptionalPart } from './optional'

/**
 * Make all fields of `O` optional (deeply or not)
 * @param O to make optional
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @returns [[Object]]
 * @example
 * ```ts
 * import type {O} from 'ts-toolbelt'
 *
 * type L = {a: {b: {c: 2}}, b: 1}
 *
 * type test0 = O.Partial<L>
 * type test1 = O.Partial<L, 'deep'>
 * ```
 */
export type Partial<O extends object, depth extends Depth = 'flat'> = OptionalPart<O, depth>
