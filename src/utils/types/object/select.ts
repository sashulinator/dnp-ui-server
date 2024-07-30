import type { Match } from '../any/_internal'
import type { Pick } from './pick'
import type { SelectKeys } from './select-keys'

/**
 * Extract the fields of `O` that match `M`
 * @param O to extract from
 * @param M to select fields
 * @param match (?=`'default'`) to change precision
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Select<O extends object, M extends any, match extends Match = 'default'> = Pick<O, SelectKeys<O, M, match>>
