export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  obj = { ...obj }
  keys.forEach((key) => delete obj[key])
  return obj
}
