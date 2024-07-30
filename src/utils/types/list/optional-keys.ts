import type { OptionalKeys as OOptionalKeys } from '../object/optional-keys'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get the keys of `L` that are optional
 * @param L
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
export type OptionalKeys<L extends List> = OOptionalKeys<ObjectOf<L>>
