import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { List } from '../list/list'
import type { Prepend } from '../list/prepend'
import type { Exclude } from './exclude'
import type { Last } from './last'

/**
 * @hidden
 */
type _ListOf<U, LN extends List = [], LastU = Last<U>> = {
  0: _ListOf<Exclude<U, LastU>, Prepend<LN, LastU>>
  1: LN
}[Extends<[U], [never]>]

/**
 * Transform a [[Union]] into a [[List]]
 * (⚠️ it might not preserve order)
 * @param U to transform
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type ListOf<U extends any> = _ListOf<U> extends infer X ? Cast<X, List> : never

// ! must not be distributed
