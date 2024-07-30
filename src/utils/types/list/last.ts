import type { Length } from './length'
import type { List } from './list'
import type { Tail } from './tail'

/**
 * Get the last entry of `L`
 * @param L to extract from
 * @returns [[Any]]
 * @example
 * ```ts
 * ```
 */
export type Last<L extends List> = L[Length<Tail<L>>]
