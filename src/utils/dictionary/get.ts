import { Key } from '../core'
import { has } from '../core/is/has'
import { BaseError } from '../error'

/**
 * Returns the value associated with the given key in the dictionary, or throws an error if the dictionary or key is undefined.
 *
 * @template D - A dictionary type, where the keys are a string or symbol type, and the values are any type.
 * @template K - The key type of the dictionary.
 *
 * @param {D | undefined} [dictionary] - The dictionary object to retrieve a value from.
 * @param {K | undefined} [key] - The key to look up in the dictionary object.
 *
 * @throws {BaseError} if the dictionary or key is undefined or the key is not found in the dictionary.
 *
 * @returns {Required<D>[K]} - The value associated with the key in the dictionary object.
 */
export function get<D extends Record<K, unknown>, K extends Key>(
  dictionary: D | undefined,
  key: K | undefined
): Required<D>[K] {
  if (key === undefined || dictionary === undefined || !has(dictionary, key)) {
    throw new BaseError(`Cannot get a Dictionary item`, { key, dictionary })
  }

  return dictionary[key]
}
