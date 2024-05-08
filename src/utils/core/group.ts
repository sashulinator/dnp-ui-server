export function group<T, K extends string | number>(list: T[], cb: (item: T) => K): Record<K, T[]> {
  const map = {} as Record<K, T[]>

  for (let index = 0; index < list.length; index++) {
    const item = list[index]
    const key = cb(item)

    if (!map[key]) map[key] = []

    map[key].push(item)
  }

  return map
}
