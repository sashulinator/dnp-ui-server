import { Key } from '../core'

/**
 * Searches a dictionary object for the value associated with the given key, returning undefined if the key
 * is not found or if the dictionary is undefined.
 *
 * @template D - The type of the dictionary being searched.
 * @template K - The type of the key being searched for.
 *
 * @param {D | undefined} dictionary - The dictionary object being searched.
 * @param {K | undefined} key - The key being searched for.
 *
 * @returns {D[K] | undefined} The value associated with the given key, or undefined if not found.
 */
export function find<D extends Partial<Record<K, unknown>>, K extends Key>(
  dictionary: D | undefined,
  key: K | undefined
): D[K] | undefined {
  if (key === undefined) return undefined
  return dictionary?.[key]
}
