import type { List } from './list'

/**
 * Transform a [[List]] into an [[Union]]
 * @param L to transform
 * @returns [[Any]]
 * @example
 * ```ts
 * ```
 */
export type UnionOf<L extends List> = L[number]
