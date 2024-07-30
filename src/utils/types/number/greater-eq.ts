import type { Equals } from '../any/equals'
import type { Or } from '../boolean/or'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { _Greater } from './greater'

/**
 * @hidden
 */
export type _GreaterEq<N1 extends Iteration, N2 extends Iteration> = Or<Equals<N1, N2>, _Greater<N1, N2>>

/**
 * Check if a [[Number]] is greater or equal to another one
 * @param N1 to compare
 * @param N2 to compare to
 * @returns [[Boolean]]
 * @example
 * ```ts
 * import type {N} from 'ts-toolbelt'
 *
 * type test0 = N.GreaterEq<'7', '5'> // True
 * type test1 = N.GreaterEq<'5', '5'> // True
 * type test2 = N.GreaterEq<'5', '7'> // False
 * ```
 */
export type GreaterEq<N1 extends number, N2 extends number> = N1 extends unknown
  ? N2 extends unknown
    ? _GreaterEq<IterationOf<N1>, IterationOf<N2>>
    : never
  : never
