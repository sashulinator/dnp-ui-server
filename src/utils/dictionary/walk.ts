import { isObject } from '../core/is/object'
import { Dictionary } from './types/dictionary'

export interface WalkResult<T> {
  key: string
  value: T
  path: string[]
  parent?: undefined | Dictionary<T>
  dictionary: Dictionary<T>
}

// TODO сделать постороже типы и убрать i из Callback
export function walk<T>(
  iterDictionary: Dictionary<T>,
  cb: (ret: WalkResult<T>) => boolean | void,
  path: string[] = [],
  dictionary?: Dictionary<T>
) {
  const valueList = Object.entries(iterDictionary)
  dictionary = dictionary ?? iterDictionary

  for (let i = 0; i < valueList.length; i++) {
    const [key, value] = valueList[i] as [string, T]
    const newPath = [...path, key]

    if (cb({ key, value, path: newPath, parent: iterDictionary, dictionary })) {
      break
    }

    if (isObject(value)) {
      walk(value as Dictionary<T>, cb, newPath, dictionary)
    }
  }
}
