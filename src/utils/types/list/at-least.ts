import type { Keys } from '../any/keys'
import type { AtLeast as OAtLeast } from '../object/at-least'
import type { _ListOf } from '../object/list-of'
import type { Key } from './_internal'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Make that at least one of the keys `K` are required in `L` at a time.
 * @param L to make required
 * @param K (?=`keyof L`) to choose fields
 * @returns [[List]] [[Union]]
 * @example
 * ```ts
 * import type {L} from 'ts-toolbelt'
 *
 * type test0 = L.AtLeast<[1, 2, 3], 0> // [1, 2 | undefined, 3 | undefined]
 * type test1 = L.AtLeast<[1, 2, 3], 0 | 1> // [1, 2 | undefined, 3 | undefined] | [1 | undefined, 2, 3 | undefined]
 * type test2 = L.AtLeast<[1, 2, 3]>
 * // | [1, 2, 3]
 * // | [1, 2 | undefined, 3 | undefined]
 * // | [1 | undefined, 2, 3 | undefined]
 * // | [1 | undefined, 2 | undefined, 3]
 * ```
 */
export type AtLeast<L extends List, K extends Key = Keys<L>> = OAtLeast<
  ObjectOf<L>,
  `${K & number}` | K
> extends infer U
  ? U extends unknown // we distribute over the union
    ? _ListOf<U & {}> // each union member to a list
    : never
  : never

declare const sym: unique symbol
