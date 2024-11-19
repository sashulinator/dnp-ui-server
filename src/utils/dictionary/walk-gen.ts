import { Dictionary } from './types/dictionary'

/**
 * Represents the result of traversing a dictionary object or any other collection.
 *
 * @template T - The value type of the collection being traversed.
 */
export interface TraversalResult<T> {
  /**
   * The key of the current value in the collection being traversed.
   */
  key: string

  /**
   * The current value in the collection being traversed.
   */
  value: T

  /**
   * An array of keys representing the path to the current value in the collection being traversed.
   */
  path: string[]

  /**
   * The parent dictionary object of the current value in the collection being traversed.
   */
  parent?: undefined | Dictionary<T>

  /**
   * The original dictionary object being traversed.
   */
  dictionary: Dictionary<T>
}

/**
 * Traverses a dictionary object and yields a generator for each key-value pair found.
 *
 * @template T - The value type of the dictionary object.
 *
 * @param {Dictionary<T>} dictionary - The dictionary object to traverse.
 *
 * @yields {TraversalResult<T>} - A generator yielding the traversal result for each key-value pair found in the dictionary.
 */
export function* walk<T>(dictionary: Dictionary<T>): Generator<TraversalResult<T>> {
  function* _walk(dictionary: Dictionary<T>) {
    const keys = Object.keys(dictionary)
    for (const key of keys) {
      const value = dictionary[key]
      yield { key, value, parent: undefined, dictionary, keys, path: [key] }
    }
  }

  yield* _walk(dictionary)
}
