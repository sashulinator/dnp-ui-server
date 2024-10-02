import { type Comparison } from '../models/comparison'
import { type FilterConfig } from '../models/filter-config'
import { type IntFilter } from '../models/int-filter'
import { type IsFilter } from '../models/is-filter'
import type { StringFilter } from '../models/string-filter'

export function toFilterConfig(filter: StringFilter | IntFilter | IsFilter): FilterConfig {
  const ret: FilterConfig = {
    type: 'startsWith',
    value: null,
    caseSensitive: undefined,
    notMode: undefined,
  }

  if (!filter) return ret

  Object.entries(filter || {})?.reduce((acc, [key, value]) => {
    if (key === 'caseSensitive') {
      acc.caseSensitive = value as boolean
      return acc
    }

    if (key === 'notMode') {
      acc.notMode = value as boolean
      return acc
    }

    acc.type = key as Comparison
    acc.value = value as string

    return acc
  }, ret)

  return ret
}
