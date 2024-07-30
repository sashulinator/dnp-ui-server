import type { Length as LLength } from '../list/length'
import type { Function } from './function'
import type { Parameters } from './parameters'

/**
 * Extract arguments' length from a [[Function]]
 * @param F to extract from
 * @returns [[String]] or `number`
 * @example
 * ```ts
 * import type {F} from 'ts-toolbelt'
 *
 * const fn = (a1: any, a2: any) => {}
 *
 * type test0 = F.LengthOf<typeof fn>               // 2
 *
 * type test1 = F.LengthOf<(a1?: any) => any>       // 0 | 1
 *
 * type test2 = F.LengthOf<(...a: any[]) => any>    // number
 * ```
 */
export type Length<Fn extends Function> = LLength<Parameters<Fn>>
