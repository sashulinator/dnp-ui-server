import type { Key } from '../any/key'
import type { Path as OPath } from '../object/path'
import type { List } from './list'

/**
 * Get in `L` the type of nested properties
 * @param L to be inspected
 * @param Path to be followed
 * @returns [[Any]]
 * @example
 * ```ts
 * ```
 */
export type Path<L extends List, Path extends List<Key>> = OPath<L, Path>
