import type { Cast } from '../any/cast'
import type { List } from '../list/list'
import type { Literal } from './_Internal'

/**
 * @hidden
 */
type _Join<T extends List, D extends string> = T extends []
  ? ''
  : T extends [Literal]
    ? `${T[0]}`
    : T extends [Literal, ...infer R]
      ? `${T[0]}${D}${_Join<R, D>}`
      : string

/**
 * Concat many literals together
 * @param T to concat
 * @param D to delimit
 */
export type Join<T extends List<Literal>, D extends string = ''> = _Join<T, D> extends infer X ? Cast<X, string> : never
