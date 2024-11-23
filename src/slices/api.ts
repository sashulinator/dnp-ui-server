import { type Any } from '~/utils/core'

export type Data<P> = {
  id: string
  params: P
}

export function serialize<T extends Record<string, unknown>>(v: Record<keyof T, Any>): Any {
  return v as Any
}
