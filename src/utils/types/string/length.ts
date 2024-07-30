import type { Length as LLength } from '../list/length'
import type { Split } from './split'

/**
 * Get the length of a `string`
 * @param S
 */
export type Length<S extends string> = LLength<Split<S, ''>>
