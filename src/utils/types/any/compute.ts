import type { BuiltIn } from '../misc/builtIn'
import type { Depth } from '../object/_internal'
import type { Has } from '../union/has'
import type { If } from './if'
import type { Key } from './key'

/**
 * @hidden
 */
export type ComputeRaw<A extends any> = A extends Function ? A : { [K in keyof A]: A[K] } & unknown

/**
 * @hidden
 */
type ComputeFlat<A extends any> = A extends BuiltIn
  ? A
  : A extends Array<any>
    ? A extends Array<Record<Key, any>>
      ? Array<{ [K in keyof A[number]]: A[number][K] } & unknown>
      : A
    : A extends ReadonlyArray<any>
      ? A extends ReadonlyArray<Record<Key, any>>
        ? ReadonlyArray<{ [K in keyof A[number]]: A[number][K] } & unknown>
        : A
      : { [K in keyof A]: A[K] } & unknown

/**
 * @hidden
 */
type ComputeDeep<A extends any, Seen = never> = A extends BuiltIn
  ? A
  : If<
      Has<Seen, A>,
      A,
      A extends Array<any>
        ? A extends Array<Record<Key, any>>
          ? Array<{ [K in keyof A[number]]: ComputeDeep<A[number][K], A | Seen> } & unknown>
          : A
        : A extends ReadonlyArray<any>
          ? A extends ReadonlyArray<Record<Key, any>>
            ? ReadonlyArray<{ [K in keyof A[number]]: ComputeDeep<A[number][K], A | Seen> } & unknown>
            : A
          : { [K in keyof A]: ComputeDeep<A[K], A | Seen> } & unknown
    >

/**
 * Force TS to load a type that has not been computed (to resolve composed
 * types that TS haven't fully resolved, for display purposes mostly).
 * @param A to compute
 * @returns `A`
 * @example
 * ```ts
 * import type {A} from 'ts-toolbelt'
 *
 * type test0 = A.Compute<{x: 'x'} & {y: 'y'}> // {x: 'x', y: 'y'}
 * ```
 */
export type Compute<A extends any, depth extends Depth = 'deep'> = {
  flat: ComputeFlat<A>
  deep: ComputeDeep<A>
}[depth]
