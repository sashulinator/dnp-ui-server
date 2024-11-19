// https://github.com/final-form/final-form/blob/main/src/structure/getIn.js
import { Any, Key } from '../core'

/**
 * Retrieves the value in a nested object structure specified by the given path.
 *
 * @template D - The type of the dictionary being searched.
 * @template P - The type of the key path being searched for.
 *
 * @param {D} dictionary - The dictionary object being searched.
 * @param {P} path - The path of keys to the desired value.
 *
 * @return {Any} The value found at the end of the specified key path.
 */
export function getPath<D, P extends Key[]>(dictionary: D, path: P): Any {
  let current: any = dictionary
  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    if (
      current === undefined ||
      current === null ||
      typeof current !== 'object' ||
      // @ts-ignore
      (Array.isArray(current) && isNaN(key))
    ) {
      return undefined
    }
    current = current[key]
  }
  return current
}
