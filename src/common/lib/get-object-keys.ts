export function getObjectKeys<T extends Record<string, unknown>>(input: T): [keyof T] {
  return Object.keys(input) as [keyof T]
}
