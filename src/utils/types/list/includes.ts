import type { Match } from '../any/_internal'
import type { Includes as OIncludes } from '../object/includes'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Check whether `L` has entries that match `M`
 * @param L to be inspected
 * @param M to check entry type
 * @param match (?=`'default'`) to change precision
 * @returns [[Boolean]]
 * @example
 * ```ts
 * ```
 */
export type Includes<L extends List, M extends any, match extends Match = 'default'> = OIncludes<ObjectOf<L>, M, match>
