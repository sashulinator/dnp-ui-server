import type { Match } from '../any/_internal'
import type { Is } from '../any/is'
import type { Key } from '../any/key'
import type { List } from '../list/list'
import type { Path as OPath } from './path'

/**
 * Check whether `O` has nested properties that match `M`
 * @param O to be inspected
 * @param Path to be followed
 * @param M (?=`any`) to check field type
 * @param match (?=`'default'`) to change precision
 * @returns [[Boolean]]
 * @example
 * ```ts
 * ```
 */
export type HasPath<
  O extends object,
  Path extends List<Key>,
  M extends any = any,
  match extends Match = 'default',
> = Is<OPath<O, Path>, M, match>
