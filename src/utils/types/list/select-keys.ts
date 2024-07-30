import type { Match } from '../any/_internal'
import type { SelectKeys as OSelectKeys } from '../object/select-keys'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get the keys of `L` which entries match `M`
 * @param L to extract from
 * @param M to select entries
 * @param match (?=`'default'`) to change precision
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
export type SelectKeys<L extends List, M extends any, match extends Match = 'default'> = OSelectKeys<
  ObjectOf<L>,
  M,
  match
>
