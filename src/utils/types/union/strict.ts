import type { ComputeRaw } from '../any/compute'
import type { Keys } from '../any/keys'
import type { OptionalFlat } from '../object/optional'
import type { Record } from '../object/record'

/**
 * @hidden
 */
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<Record<Exclude<Keys<_U>, keyof U>, never>> : never

/**
 * Make a [[Union]] not allow excess properties (https://github.com/Microsoft/TypeScript/issues/20863)
 * @param U to make strict
 * @returns [[Union]]
 * @example
 * ```ts
 * ```
 */
export type Strict<U extends object> = ComputeRaw<_Strict<U>>
