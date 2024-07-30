import type { NonNullableKeys as ONonNullableKeys } from '../object/non-nullable-keys'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get the keys of `L` that are non-nullable
 * @param L
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
export type NonNullableKeys<L extends List> = ONonNullableKeys<ObjectOf<L>>
