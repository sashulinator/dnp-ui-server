export function isPrimitive(value: unknown): value is boolean | string | number | bigint | symbol | undefined | null {
  return value !== Object(value)
}
