/**
 * Applies a function to each value in a dictionary and returns a new dictionary with the same keys and transformed values.
 *
 * @template K - The key type of the input and output dictionaries.
 * @template T - The value type of the input dictionary.
 * @template U - The value type of the output dictionary.
 *
 * @param {Record<K, T>} dictionary - The dictionary to transform.
 * @param {(x: T) => U} f - The function to apply to each value in the dictionary.
 *
 * @returns {Record<K, U>} - A new dictionary with the same keys as the input dictionary and transformed values.
 */
export function map<K extends string, T, U>(dictionary: Record<K, T>, f: (x: T, k: string) => U): Record<K, U> {
  return Object.keys(dictionary).reduce(
    (ret, key) => {
      const k = key as K
      ret[k] = f(dictionary[k], k)
      return ret
    },
    {} as Record<K, U>
  )
}
