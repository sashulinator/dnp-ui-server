import type { Match } from '../any/_internal'
import type { FilterKeys } from './filter-keys'
import type { Pick } from './pick'

/**
 * Filter out of `O` the fields that match `M`
 * @param O to remove from
 * @param M to select fields
 * @param match (?=`'default'`) to change precision
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Filter<O extends object, M extends any, match extends Match = 'default'> = Pick<O, FilterKeys<O, M, match>>
