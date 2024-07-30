import type { Key } from '../any/key'
import type { Record } from './record'

/**
 * An [[Object]]
 * @example
 * ```ts
 * type object0 = {a: "hello"}
 * type string1 = {b: "world"}
 * ```
 */
export type Object = Record<Key, any>
