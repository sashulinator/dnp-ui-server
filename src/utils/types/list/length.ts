import type { List } from './list'

/**
 * Get the length of `L`
 * @param L to get length
 * @returns [[String]] or `number`
 * @example
 * ```ts
 * ```
 */
export type Length<L extends List> = L['length']
