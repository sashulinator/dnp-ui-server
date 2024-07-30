import type { Key } from '../any/key'
import type { BuiltIn } from '../misc/builtIn'
import type { Depth } from './_internal'
import type { PatchFlat } from './patch'
import type { _Pick } from './pick'

/**
 * @hidden
 */
export type ReadonlyFlat<O> = {
  +readonly [K in keyof O]: O[K]
} & {}

/**
 * @hidden
 */
export type ReadonlyDeep<O> = {
  +readonly [K in keyof O]: O[K] extends BuiltIn ? O[K] : ReadonlyDeep<O[K]>
}

/**
 * @hidden
 */
export type ReadonlyPart<O extends object, depth extends Depth> = {
  flat: ReadonlyFlat<O>
  deep: ReadonlyDeep<O>
}[depth]

/**
 * @hidden
 */
export type _Readonly<O extends object, K extends Key, depth extends Depth> = PatchFlat<
  ReadonlyPart<_Pick<O, K>, depth>,
  O
>

/**
 * Make some fields of `O` readonly (deeply or not)
 * @param O to make readonly
 * @param K (?=`Key`) to choose fields
 * @param depth (?=`'default'`) to do it deeply
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Readonly<O extends object, K extends Key = Key, depth extends Depth = 'flat'> = O extends unknown
  ? _Readonly<O, K, depth>
  : never
