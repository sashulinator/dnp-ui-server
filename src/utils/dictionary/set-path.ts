import { Dictionary, Key } from '../core'

type State = Object | unknown[] | void

const setPathRecursor = (current: State, index: number, path: Key[], value: any, destroyArrays: boolean): State => {
  if (index >= path.length) {
    // end of recursion
    return value
  }
  const key = path[index]

  // determine type of key
  // @ts-ignore
  if (isNaN(key)) {
    // object set
    if (current === undefined || current === null) {
      // recurse
      const result = setPathRecursor(undefined, index + 1, path, value, destroyArrays)

      // delete or create an object
      return result === undefined ? undefined : { [key]: result }
    }
    if (Array.isArray(current)) {
      throw new Error('Cannot set a non-numeric property on an array')
    }
    // current exists, so make a copy of all its values, and add/update the new one
    // @ts-ignore
    const result = setPathRecursor(current[key], index + 1, path, value, destroyArrays)
    if (result === undefined) {
      const numKeys = Object.keys(current).length
      // @ts-ignore
      if (current[key] === undefined && numKeys === 0) {
        // object was already empty
        return undefined
      }
      // @ts-ignore
      if (current[key] !== undefined && numKeys <= 1) {
        // only key we had was the one we are deleting
        // @ts-ignore
        if (!isNaN(path[index - 1]) && !destroyArrays) {
          // we are in an array, so return an empty object
          return {}
        } else {
          return undefined
        }
      }

      // @ts-ignore
      const { [key]: _removed, ...final } = current
      return final
    }
    // set result in key
    return {
      ...current,
      [key]: result,
    }
  }
  // array set
  const numericKey = Number(key)
  if (current === undefined || current === null) {
    // recurse
    const result = setPathRecursor(undefined, index + 1, path, value, destroyArrays)

    // if nothing returned, delete it
    if (result === undefined) {
      return undefined
    }

    // create an array
    const array = []
    // @ts-ignore
    array[numericKey] = result
    return array
  }
  if (!Array.isArray(current)) {
    throw new Error('Cannot set a numeric property on an object')
  }
  // recurse
  const existingValue = current[numericKey]
  const result = setPathRecursor(existingValue, index + 1, path, value, destroyArrays)

  // current exists, so make a copy of all its values, and add/update the new one
  const array = [...current]
  if (destroyArrays && result === undefined) {
    array.splice(numericKey, 1)
    if (array.length === 0) {
      return undefined
    }
  } else {
    array[numericKey] = result
  }
  return array
}

export function setPath<D extends Dictionary>(state: D, path: Key[], value: any, destroyArrays = false): D {
  if (state === undefined || state === null) {
    throw new Error(`Cannot call setPath() with ${String(state)} state`)
  }
  if (path === undefined || path === null) {
    throw new Error(`Cannot call setPath() with ${String(path)} key`)
  }

  // Recursive function needs to accept and return State, but public API should
  // only deal with Objects
  return setPathRecursor(state, 0, path, value, destroyArrays) as D
}
