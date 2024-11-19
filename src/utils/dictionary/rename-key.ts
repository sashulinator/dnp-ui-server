export function renameKey<D extends Record<string, unknown>, F extends string, P extends string>(
  obj: D,
  from: F,
  to: P,
): Omit<{ [K in keyof D]: D[K] }, F> & { [K in P]: D[K] } {
  const entries = Object.entries(obj)

  const result = {}

  for (let index = 0; index < entries.length; index++) {
    const [key, value] = entries[index]
    if (key === from) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      result[to] = value
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      result[key] = value
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return result
}
