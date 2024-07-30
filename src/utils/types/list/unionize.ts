import type { At } from '../any/at'
import type { Key } from '../any/key'
import type { List } from './list'

/**
 * Make the fields of `L` union the ones of `L1`
 * @param L to union from
 * @param L1 to union with
 * @param K (?=`Key`) to do choose fields
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Unionize<L extends List, L1 extends List, K extends Key = Key> = {
  [P in keyof L]: P extends K ? L[P] | At<L1, P> : L[P]
}
