import type { ComputeRaw } from '../any/compute'
import type { Extends } from '../any/extends'
import type { Key } from '../any/key'
import type { Keys } from '../any/keys'
import type { _Omit } from './omit'
import type { OptionalFlat } from './optional'
import type { _Pick } from './pick'
import type { RequiredFlat } from './required'

/**
 * @hidden
 */
type RequiredIfKeys<O extends object, K extends Key> = Extends<keyof O & K, K> extends 1 ? RequiredFlat<O> : O

/**
 * @hidden
 */
type __AtLeast<O extends object, K extends Key> = K extends keyof O // if we can operate on it
  ? _Pick<O, K> & OptionalFlat<O> // take entry & make rest optional
  : O

/**
 * @hidden
 */
type _AtLeast<O extends object, K extends Key> = ComputeRaw<__AtLeast<RequiredIfKeys<O, K>, K>>

/**
 * Make that at least one of the keys `K` are required in `O` at a time.
 * @param O to make required
 * @param K (?=`keyof O`) to choose fields
 * @returns [[Object]] [[Union]]
 * @example
 * ```ts
 * ```
 */
export type AtLeast<O extends object, K extends Key = Keys<O>> = O extends unknown ? _AtLeast<O, K> : never
