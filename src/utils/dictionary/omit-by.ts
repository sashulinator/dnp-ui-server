// https://github.com/jonschlinkert/omit-empty/blob/master/index.js
import { type Dictionary, isObject } from '../core'

export function omitBy<T extends Dictionary>(cb: (v: unknown) => boolean, obj: Dictionary): T {
  const omit = (value: unknown) => {
    if (Array.isArray(value)) {
      value = value.map((v) => omit(v)).filter((v) => !cb(v))
    }

    if (isObject(value)) {
      const result = {}
      for (const key of Object.keys(value)) {
        const val = omit(value[key])
        if (val !== void 0) {
          // @ts-ignore
          result[key] = val
        }
      }
      value = result
    }

    if (!cb(value)) {
      return value
    }
  }

  const res = omit(obj)
  if (res === void 0) {
    return (isObject(obj) ? {} : res) as T
  }
  return res as T
}
