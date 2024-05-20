/**
 * Stolen from ramda
 * Original name was ObjectHavingSome
 */
import { Key } from './key'

export type Has<K extends Key> = {
  [I in K]: { [P in I]: unknown }
}[K]
