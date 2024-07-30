import type { Paths as OPaths } from '../object/paths'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get all the possible paths of `L`
 * (⚠️ this won't work with circular-refs)
 * @param L to be inspected
 * @returns [[String]][]
 * @example
 * ```ts
 * ```
 */
export type Paths<L extends List> = OPaths<ObjectOf<L>>
