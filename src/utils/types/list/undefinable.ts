import type { Cast } from '../any/cast'
import type { x } from '../any/x'
import type { Update } from '../object/update'
import type { Key } from './_internal'
import type { List } from './list'

/**
 * Make some entries of `L` not `undefined` (deeply or not)
 * @param L to make non nullable
 * @param K (?=`Key`) to choose fields
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Undefinable<L extends List, K extends Key = Key> = Cast<Update<L, `${K & number}` | K, x | undefined>, List>
