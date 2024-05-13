import { Key } from '../types/key'

/**
 * Determines whether a value is an object.
 *
 * @param {unknown} val - The value to test.
 * @return {boolean} `true` if the value is an object, `false` otherwise.
 */
export function isObject(val: unknown): val is Record<Key, unknown> {
  return typeof val === 'object' && !Array.isArray(val) && val !== null
}
