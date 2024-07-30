import type { CompulsoryKeys as OCompulsoryKeys } from '../object/compulsory-keys'
import type { List } from './list'
import type { ObjectOf } from './object-of'

/**
 * Get the keys of `L` that are [[Compulsory]]
 *
 * (⚠️ needs `--strictNullChecks` enabled)
 * @param L
 * @returns [[Key]]
 * @example
 * ```ts
 * import type {L} from 'ts-toolbelt'
 *
 * type test0 = L.CompulsoryKeys<[1, 2, 3]> // {0: 1, 1: 2, 2: 3}
 * ```
 */
export type CompulsoryKeys<L extends List> = OCompulsoryKeys<ObjectOf<L>>
