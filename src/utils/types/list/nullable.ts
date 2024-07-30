import type { Cast } from '../any/cast'
import type { x } from '../any/x'
import type { Update } from '../object/update'
import type { Key } from './_internal'
import type { List } from './list'

/**
 * Make some entries of `L` nullable (deeply or not)
 * @param L to make nullable
 * @param K (?=`Key`) to choose fields
 * @param depth (?=`'flat'`) 'deep' to do it deeply
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Nullable<L extends List, K extends Key = Key> = Cast<
  Update<L, `${K & number}` | K, x | null | undefined>,
  List
>
