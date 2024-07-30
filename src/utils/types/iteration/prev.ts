import type { Iteration, IterationMap } from './iteration'

/**
 * Move `I`'s position backwards
 * @param I to move
 * @returns [[Iteration]]
 * @example
 * ```ts
 * import type {I} from 'ts-toolbelt'
 *
 * type i = I.IterationOf<'20'>
 *
 * type test0 = I.Pos<i>         // 20
 * type test1 = I.Pos<I.Prev<i>> // 19
 * ```
 */
export type Prev<I extends Iteration> = IterationMap[I[2]] // continues iterating
