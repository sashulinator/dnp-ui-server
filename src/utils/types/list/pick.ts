import type { _ListOf } from '../object/list-of'
import type { _Pick as _OPick } from '../object/pick'
import type { Key } from './_internal'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * @hidden
 */
export type _Pick<L extends List, K extends Key> = _ListOf<_OPick<ObjectOf<L>, `${K & number}` | K>>

/**
 * Extract out of `L` the entries of key `K`
 * @param L to extract from
 * @param K to chose entries
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Pick<L extends List, K extends Key> = L extends unknown ? _Pick<L, K> : never
