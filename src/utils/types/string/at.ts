import type { At as AAt } from '../any/at'
import type { Split } from './split'

/**
 * Get the character at position `K`
 * @param S
 * @param K
 */
export type At<S extends string, K extends number> = AAt<Split<S, ''>, K>
