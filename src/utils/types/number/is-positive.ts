import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { _IsNegative } from './is-negative'

/**
 * @hidden
 */
export type _IsPositive<N extends Iteration> = {
  '-': 0
  '+': 1
  '0': 0
}[N[1]]

/**
 * Check whether a [[Number]] is positive or not
 * @param N to check
 * @returns [[Boolean]]
 * @example
 * ```ts
 * import type {N} from 'ts-toolbelt'
 *
 * type test0 = N.IsPositive<'0'>  // False
 * type test1 = N.IsPositive<'-7'> // False
 * type test2 = N.IsPositive<'7'>  // True
 * ```
 */
export type IsPositive<N extends number> = _IsPositive<IterationOf<N>>
