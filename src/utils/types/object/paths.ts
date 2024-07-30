import type { Cast } from '../any/cast'
import type { Key } from '../any/key'
import type { Keys } from '../any/keys'
import type { Length } from '../list/length'
import type { List } from '../list/list'
import type { BuiltIn } from '../misc/builtIn'
import type { Primitive } from '../misc/primitive'
import type { NonNullableFlat } from './non-nullable'

/**
 * @hidden
 */
type UnionOf<A> = A extends List ? A[number] : A[keyof A]

/**
 * @hidden
 */
type _Paths<O, P extends List = []> = UnionOf<{
  [K in keyof O]: O[K] extends BuiltIn | Primitive
    ? NonNullableFlat<[...P, K?]>
    : [Keys<O[K]>] extends [never]
      ? NonNullableFlat<[...P, K?]>
      : 12 extends Length<P>
        ? NonNullableFlat<[...P, K?]>
        : _Paths<O[K], [...P, K?]>
}>

/**
 * Get all the possible paths of `O`
 * (⚠️ this won't work with circular-refs)
 * @param O to be inspected
 * @returns [[String]][]
 * @example
 * ```ts
 * ```
 */
export type Paths<O, P extends List = []> = _Paths<O, P> extends infer X ? Cast<X, List<Key>> : never
