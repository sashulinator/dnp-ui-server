import type { RequiredKeys as ORequiredKeys } from '../object/required-keys'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get the keys of `L` that are readonly
 * @param L
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
export type RequiredKeys<L extends List> = ORequiredKeys<ObjectOf<L>>
