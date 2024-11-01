import { type Dictionary } from '~/utils/core'

import { getKeys } from '../../dictionary'
import { type ComparisonKey } from '../models/comparison'
import { type FilterConfig } from '../models/filter-config'
import { INT_MODE } from '../models/int-mode'
import { MATCH } from '../models/match'
import { MATCH_MODE } from '../models/match-mode'
import { type ReplaceValueByFilter } from '../models/where'

export function toFilterConfig<T extends Dictionary>(
  filter: ReplaceValueByFilter<T>[keyof T] | undefined,
): FilterConfig {
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
