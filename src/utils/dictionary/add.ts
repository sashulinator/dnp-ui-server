import { type Key } from '../core'

function add<D extends Partial<Record<K, V>>, K extends Key, V>(dictionary: D, key: K, value: V): D & { [k in K]: V }
/**
 * Adds a new key-value pair to a dictionary object or updates an existing one
 * returning the new instance of dictionary object.
 *
 * @template D - The type of the dictionary being updated.
 * @template K - The type of the key being added or updated.
 * @template V - The type of the value being added or updated.
 *
 * @param {D} dictionary - The dictionary to be updated.
 * @param {K} key - The key being added or updated.
 * @param {V} value - The value being added or updated.
 *
 * @returns {D} The new instance of dictionary object.
 */
function add<D extends Partial<Record<K, V>>, K extends Key, V>(dictionary: D, key: K, value: V): D {
  return { ...dictionary, [key]: value }
}

export { add }
