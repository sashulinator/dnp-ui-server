import type { Cast } from '../any/cast'
import type { BuiltIn } from '../misc/builtIn'
import type { Depth } from '../object/_internal'
import type { _Pick } from '../object/pick'
import type { NonNullable as UNonNullable } from '../union/non-nullable'
import type { Key } from './_internal'
import type { List } from './list'

/**
 * @hidden
 */
export type NonNullableFlat<O, K extends Key = Key> = {
  [P in keyof O]: P extends K ? UNonNullable<O[P]> : O[P]
} & {}

/**
 * @hidden
 */
type _NonNullableDeep<O> = {
  [K in keyof O]: O[K] extends BuiltIn ? O[K] : NonNullableDeep<O[K], Key>
}

/**
 * @hidden
 */
export type NonNullableDeep<O, K extends Key = Key> = _NonNullableDeep<NonNullableFlat<O, K>>

/**
 * @hidden
 */
export type NonNullablePart<O extends object, K extends Key, depth extends Depth> = {
  flat: NonNullableFlat<O, K>
  deep: NonNullableDeep<O, K>
}[depth]

/**
 * Make some entries of `L` not nullable (deeply or not)
 * @param L to make non nullable
 * @param K (?=`Key`) to choose fields
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type NonNullable<L extends List, K extends Key = Key, depth extends Depth = 'flat'> = Cast<
  NonNullablePart<L, `${K & number}` | K, depth>,
  List
>
