import type { Key } from '../any/key'
import type { BuiltIn } from '../misc/builtIn'
import type { NonNullable } from '../union/non-nullable'
import type { Depth } from './_internal'
import type { PatchFlat } from './patch'
import type { _Pick } from './pick'

/**
 * @hidden
 */
export type CompulsoryFlat<O> = {
  [K in keyof O]-?: NonNullable<O[K]>
} & {}

/**
 * @hidden
 */
export type CompulsoryDeep<O> = {
  [K in keyof O]-?: O[K] extends BuiltIn ? O[K] : CompulsoryDeep<NonNullable<O[K]>>
}

/**
 * @hidden
 */
export type CompulsoryPart<O extends object, depth extends Depth> = {
  flat: CompulsoryFlat<O>
  deep: CompulsoryDeep<O>
}[depth]

/**
 * @hidden
 */
export type _Compulsory<O extends object, K extends Key, depth extends Depth> = PatchFlat<
  CompulsoryPart<_Pick<O, K>, depth>,
  O
>

/**
 * Make that `O`'s fields cannot be [[Nullable]] or [[Optional]] (it's like
 * [[Required]] & [[NonNullable]] at once).
 * @param O to make compulsory
 * @param K (?=`Key`) to choose fields
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Compulsory<O extends object, K extends Key = Key, depth extends Depth = 'flat'> = O extends unknown
  ? _Compulsory<O, K, depth>
  : never
