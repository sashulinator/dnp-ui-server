import { Dictionary } from './types/dictionary'

/**
 * Removes a property with the specified key from the dictionary and returns a new dictionary without that property.
 *
 * @template D - The type of the input dictionary object.
 * @template K - The type of the key to remove from the dictionary.
 *
 * @param {D} dictionary - The dictionary object to remove the property from.
 * @param {K} key - The key of the property to remove from the dictionary.
 *
 * @returns {Omit<D, K>} - A new dictionary object without the specified property/key.
 */
export function remove<D extends Dictionary<any>, K extends keyof D>(dictionary: D, key: K): Omit<D, K> {
  const { [key]: removed, ...newObject } = dictionary
  return newObject
}
