import type { UndefinableKeys as OUndefinableKeys } from '../object/undefinable-keys'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get the keys of `L` that are `undefined`
 * @param L
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
export type UndefinableKeys<L extends List> = OUndefinableKeys<ObjectOf<L>>
