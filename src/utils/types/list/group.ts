import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { Append } from './append'
import type { _Drop } from './drop'
import type { List } from './list'
import type { _Take } from './take'

/**
 * @hidden
 */
type __Group<L extends List, N extends number, LN extends List = []> = {
  0: __Group<_Drop<L, N>, N, Append<LN, _Take<L, N>>>
  1: LN
}[Extends<L, List<never>>]

/**
 * @hidden
 */
export type _Group<L extends List, N extends number> = __Group<L, N> extends infer X ? Cast<X, List> : never

/**
 * Split `L` into sub-[[List]]s every `N`
 * @param L to group
 * @param N to split at
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Group<L extends List, N extends number> = L extends unknown
  ? N extends unknown
    ? _Group<L, N>
    : never
  : never
