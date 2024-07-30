import type { Match } from '../any/_internal'
import type { Key } from '../any/key'
import type { HasPath as OHasPath } from '../object/has-path'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Check whether `L` has nested entries that match `M`
 * @param L to be inspected
 * @param Path to be followed
 * @param M (?=`any`) to check entry type
 * @param match (?=`'default'`) to change precision
 * @returns [[Boolean]]
 * @example
 * ```ts
 * ```
 */
export type HasPath<
  L extends List,
  Path extends List<Key>,
  M extends any = any,
  match extends Match = 'default',
> = OHasPath<ObjectOf<L>, Path, M, match>
