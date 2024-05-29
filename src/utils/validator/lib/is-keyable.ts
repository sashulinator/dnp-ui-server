import { isObject } from '~/utils/core'

export function isKeyable(value: unknown): value is Record<string, unknown> {
  return (isObject(value) || typeof value === 'function') && Object.keys(value).length > 0
}
