import { type Dictionary } from '~dnp/utils/core'

import { getKeys } from '../../dictionary'
import { type FilterConfig } from '../models/filter-config'
import { type IntFilter } from '../models/int-filter'
import { INT_MODE } from '../models/int-mode'
import { MATCH_MODE } from '../models/match-mode'
import { type StringFilter } from '../models/string-filter'
import { type ReplaceValueByFilter } from '../models/where'

export function toFilter<T extends Dictionary>(filterConfig: FilterConfig): ReplaceValueByFilter<T> {
  const filter: StringFilter | IntFilter = {
    [filterConfig.type as 'contains']: filterConfig.value,
  }

  const modeKeys = [...getKeys(MATCH_MODE), ...getKeys(INT_MODE)]

  for (const modeKey of modeKeys) {
    if (filterConfig[modeKey] === undefined) continue
    filter[modeKey] = filterConfig[modeKey] as boolean
  }

  return filter
}
