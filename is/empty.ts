import { isObject } from './object'
import { isString } from './string'

export function isEmpty(input: unknown): boolean {
  if (Array.isArray(input)) {
    return input.length === 0
  }
  if (isObject(input)) {
    return Object.keys(input).length === 0
  }
  if (isString(input)) {
    return input.length === 0
  }

  return false
}
