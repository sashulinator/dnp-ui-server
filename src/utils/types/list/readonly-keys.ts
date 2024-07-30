import type { ReadonlyKeys as OReadonlyKeys } from '../object/readonly-keys'
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
export type ReadonlyKeys<L extends List> = OReadonlyKeys<ObjectOf<L>>
