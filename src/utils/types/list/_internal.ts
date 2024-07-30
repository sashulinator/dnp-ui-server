/** @ignore */

/** */
import type { Overwrite } from '../object/overwrite'
import type { List } from './list'

/**
 * Remove `?` & `readonly` from a [[List]]
 */
export type Naked<L extends List> = Overwrite<Required<L>, L>

export type Key = string | number | symbol
