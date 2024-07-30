import type { Range } from '../number/range'
import type { UnionOf } from './union-of'

/**
 * Create a set of keys
 * @param From to start with
 * @param To to end with
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
export type KeySet<From extends number, To extends number> = UnionOf<Range<From, To, '->'>>
