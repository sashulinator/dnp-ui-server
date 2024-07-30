import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { _IsPositive } from './is-positive'
import type { _Sub } from './sub'

/**
 * @hidden
 */
export type _Greater<N1 extends Iteration, N2 extends Iteration> = _IsPositive<_Sub<N1, N2>>

/**
 * Check if a [[Number]] is bigger than another one
 * @param N1 to compare
 * @param N2 to compare to
 * @returns [[Boolean]]
 * @example
 * ```ts
 * import type {N} from 'ts-toolbelt'
 *
 * type test0 = N.Greater<'7', '5'> // True
 * type test1 = N.Greater<'5', '5'> // False
 * type test2 = N.Greater<'5', '7'> // False
 * ```
 */
export type Greater<N1 extends number, N2 extends number> = N1 extends unknown
  ? N2 extends unknown
    ? _Greater<IterationOf<N1>, IterationOf<N2>>
    : never
  : never
