import type { NullableKeys as ONullableKeys } from '../object/nullable-keys'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get the keys of `L` that are nullable
 * @param L
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
export type NullableKeys<L extends List> = ONullableKeys<ObjectOf<L>>
