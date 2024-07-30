import type { List } from '../list/list'
import type { Function } from './function'

/**
 * Extract the return type of a [[Function]]
 * @param F to extract from
 * @returns [[Any]]
 * @example
 * ```ts
 * import type {F} from 'ts-toolbelt'
 *
 * const fn = () => true
 *
 * type test0 = F.ReturnOf<typeof fn>  // boolean
 *
 * type test1 = F.ReturnOf<() => true> // true
 * ```
 */
export type Return<F extends Function> = F extends (...args: List) => infer R ? R : never
