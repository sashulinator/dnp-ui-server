import type { Iteration, IterationMap } from './iteration'

/**
 * Move `I`'s position forward
 * @param I to move
 * @returns [[Iteration]]
 * @example
 * ```ts
 * import type {I} from 'ts-toolbelt'
 *
 * type i = I.IterationOf<'20'>
 *
 * type test0 = I.Pos<i>         // 20
 * type test1 = I.Pos<I.Next<i>> // 21
 * ```
 */
export type Next<I extends Iteration> = IterationMap[I[3]]
