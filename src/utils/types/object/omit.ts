import type { Key } from '../any/key'
import type { Exclude } from '../union/exclude'
import type { _Pick } from './pick'

/**
 * @hidden
 */
export type _Omit<O extends object, K extends Key> = _Pick<O, Exclude<keyof O, K>>

/**
 * Remove out of `O` the fields of key `K`
 * @param O to remove from
 * @param K to chose fields
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Omit<O extends object, K extends Key> = O extends unknown ? _Omit<O, K> : never
