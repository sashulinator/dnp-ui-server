import type { _ListOf } from '../object/list-of'
import type { _Omit as _OOmit } from '../object/omit'
import type { Key } from './_internal'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * @hidden
 */
export type _Omit<L extends List, K extends Key> = _ListOf<_OOmit<ObjectOf<L>, `${K & number}` | K>>

/**
 * Remove out of `L` the entries of key `K`
 * @param L to remove from
 * @param K to chose entries
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Omit<L extends List, K extends Key> = L extends unknown ? _Omit<L, K> : never
