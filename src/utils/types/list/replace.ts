import type { Match } from '../any/_internal'
import type { Cast } from '../any/cast'
import type { Replace as OReplace } from '../object/replace'
import type { List } from './list'

/**
 * Update with `A` the entries of `L` that match `M`
 * @param O to update
 * @param M to select fields
 * @param A to update with
 * @param match (?=`'default'`) to change precision
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Replace<L extends List, M extends any, A extends any, match extends Match = 'default'> = Cast<
  OReplace<L, M, A, match>,
  List
>
