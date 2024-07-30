import type { Cast } from '../any/cast'
import type { Update as OUpdate } from '../object/update'
import type { Key } from './_internal'
import type { List } from './list'

/**
 * Update in `L` the entries of key `K` with `A`.
 * Use the [[x]] placeholder to get the current field type.
 * @param L to update
 * @param K to chose fields
 * @param A to update with
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Update<L extends List, K extends Key, A extends any> = Cast<OUpdate<L, `${K & number}` | K, A>, List>
