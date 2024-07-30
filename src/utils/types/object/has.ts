import type { Match } from '../any/_internal'
import type { At } from '../any/at'
import type { Is } from '../any/is'
import type { Key } from '../any/key'

/**
 * Check whether `O` has a field of key `K` that matches `M`
 * @param O to be inspected
 * @param K to choose field
 * @param M (?=`any`) to check field type
 * @param match (?=`'default'`) to change precision
 * @returns [[Boolean]]
 * @example
 * ```ts
 * ```
 */
export type Has<O extends object, K extends Key, M extends any = any, match extends Match = 'default'> = Is<
  At<O, K>,
  M,
  match
>
