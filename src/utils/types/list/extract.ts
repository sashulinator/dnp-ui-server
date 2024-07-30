import type { KeySet } from './key-set'
import type { List } from './list'
import type { Pick } from './pick'

/**
 * Pick a range of entries (portion) from `L`
 * @param L to pick from
 * @param From to start with
 * @param To to end with
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Extract<L extends List, From extends number, To extends number> = Pick<L, KeySet<From, To>>
