import { getKeys } from '../../dictionary'
import { type ComparisonKey } from '../models/comparison'
import { type FilterConfig } from '../models/filter-config'
import { type IntFilter } from '../models/int-filter'
import { INT_MODE } from '../models/int-mode'
import { type IsFilter } from '../models/is-filter'
import { MATCH } from '../models/match'
import { MATCH_MODE } from '../models/match-mode'
import type { StringFilter } from '../models/string-filter'

export function toFilterConfig(filter: StringFilter | IntFilter | IsFilter): FilterConfig {
  const ret: FilterConfig = {
    type: MATCH.startsWith,
    value: null,
    caseSensitive: undefined,
    notMode: undefined,
  }

  if (!filter) return ret

  Object.entries(filter || {})?.reduce((acc, [key, value]) => {
    const modeKeys = [...getKeys(MATCH_MODE), ...getKeys(INT_MODE)]

    for (const modeKey of modeKeys) {
      if (key === modeKey) {
        acc[modeKey] = value as boolean
        return acc
      }
    }

    acc.type = key as ComparisonKey
    acc.value = value as string

    return acc
  }, ret)

  return ret
}
