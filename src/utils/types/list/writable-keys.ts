import type { WritableKeys as OWritableKeys } from '../object/writable-keys'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get the keys of `L` that are writable
 * @param L
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
export type WritableKeys<L extends List> = OWritableKeys<ObjectOf<L>>
