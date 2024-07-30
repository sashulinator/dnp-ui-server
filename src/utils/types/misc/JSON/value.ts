import type { List } from './array'
import type { Object } from './object'
import type { Primitive } from './primitive'

/**
 * Any JSON data/value
 */
export type Value = Primitive | Object | List
