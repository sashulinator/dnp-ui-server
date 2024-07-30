import type { _Omit } from '../object/omit'
import type { _Pick } from '../object/pick'
import type { Length } from './length'
import type { List } from './list'

/**
 * Transform a [[List]] into an [[Object]] equivalent
 * @param L to transform
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type ObjectOf<O extends List> = O extends unknown
  ? number extends Length<O> // detect arrays
    ? _Pick<O, number> // preserves arrays
    : _Omit<O, keyof any[]> // transforms tuples
  : never
