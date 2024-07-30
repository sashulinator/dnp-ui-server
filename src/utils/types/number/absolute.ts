import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { _IsNegative } from './is-negative'
import type { _Negate } from './negate'

/**
 * @hidden
 */
export type _Absolute<N extends Iteration> = {
  0: N
  1: _Negate<N>
}[_IsNegative<N>]

/**
 * Get the absolute value of a [[Number]]
 * @param N to absolute
 * @returns `string | number | boolean`
 * @example
 * ```ts
 * import type {N} from 'ts-toolbelt'
 *
 * type test0 = N.Absolute<'-20'>      // '20'
 *
 * type test1 = N.Absolute<'-20', 's'> // '20'
 * type test2 = N.Absolute<'-20', 'n'> //  20
 * ```
 */
export type Absolute<N extends number> = N extends unknown ? _Absolute<IterationOf<N>>[0] : never
