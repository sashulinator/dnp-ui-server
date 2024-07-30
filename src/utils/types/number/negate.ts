import type { Iteration, IterationMap } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { _Sub } from './sub'

/**
 * @hidden
 */
export type _Negate<N extends Iteration> = IterationMap[N[4]]

/**
 * Negate a [[Number]]
 * @param N to negate
 * @returns `string | number | boolean`
 * @example
 * ```ts
 * import type {N} from 'ts-toolbelt'
 *
 * type test0 = N.Negate<'-10'>     //  '10'
 * type test1 = N.Negate<'10'>      // '-10'
 * type test2 = N.Negate<'10', 's'> // '-10'
 * type test3 = N.Negate<'10', 'n'> //  -10
 * type test4 = N.Negate<'-100'>    // string
 * ```
 */
export type Negate<N extends number> = N extends unknown ? _Negate<IterationOf<N>>[0] : never
