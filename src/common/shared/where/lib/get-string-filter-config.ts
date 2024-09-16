import type { MatchMode } from '../models/match-mode'
import type { StringFilter } from '../models/string-filter'

export interface StringFilterConfig {
  caseSensitive: MatchMode | undefined
  name: keyof Omit<StringFilter, 'mode'> | undefined
  value: StringFilter | string | undefined
}

export function getStringFilterConfig(stringFilter: StringFilter | undefined): StringFilterConfig {
  const ret: StringFilterConfig = {
    name: undefined,
    caseSensitive: undefined,
    value: undefined,
  }

  if (!stringFilter) return ret

  Object.entries(stringFilter || {})?.reduce<StringFilterConfig>((acc, [key, value]) => {
    if (key === 'caseSensitive') {
      acc.caseSensitive = value as MatchMode
      return acc
    }

    acc.name = key as keyof Omit<StringFilter, 'mode'>
    acc.value = value

    return acc
  }, ret)

  return ret
}
