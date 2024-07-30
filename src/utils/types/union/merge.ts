import type { At } from '../any/at'
import type { ComputeRaw } from '../any/compute'
import type { Overwrite } from '../object/overwrite'
import type { IntersectOf } from './intersect-of'
import type { Strict } from './strict'

/**
 * @hidden
 */
type _Merge<U extends object> = IntersectOf<
  Overwrite<
    U,
    {
      [K in keyof U]-?: At<U, K>
    }
  >
>

/**
 * Merge a [[Union]] of [[Object]]s into a single one
 * @param U to merge
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>
