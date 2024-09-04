import type { QueryMode, StringFilter } from './types/where'

export interface StringFilterConfig {
  mode: QueryMode | undefined
  name: keyof Omit<StringFilter, 'mode'> | undefined
  value: StringFilter | string | undefined
}

export function getStringFilterConfig(stringFilter: StringFilter | undefined): StringFilterConfig {
  const ret = {
    name: undefined,
    mode: undefined,
    value: undefined,
  }

  if (!stringFilter) return ret

  Object.entries(stringFilter || {})?.reduce<StringFilterConfig>((acc, [key, value]) => {
    if (key === 'mode') {
      acc.mode = value as QueryMode
      return acc
    }

    acc.name = key as keyof Omit<StringFilter, 'mode'>
    acc.value = value

    return acc
  }, ret)

  return ret
}
