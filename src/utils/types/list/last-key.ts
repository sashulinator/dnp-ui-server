import type { Length } from './length'
import type { List } from './list'
import type { Tail } from './tail'

/**
 * Get the last index of `L`
 * @param L to get from
 * @returns `number`
 * @example
 * ```ts
 * ```
 */
export type LastKey<L extends List> = Length<Tail<L>>
