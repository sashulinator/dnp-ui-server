import type { Promise } from '../any/promise'
import type { Function } from './function'
import type { Parameters } from './parameters'
import type { Return } from './return'

/**
 * Creates a promisified version of a `Function` `F`
 * @param F to promisify
 * @returns async F
 * @example
 * ```ts
 * import type {F} from 'ts-toolbelt'
 *
 * type test0 = F.Promisify<(a: number) => number> // (a: number) => Promise<number>
 * ```
 */
export type Promisify<F extends Function> = (...args: Parameters<F>) => Promise<Return<F>>
