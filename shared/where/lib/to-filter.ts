import { type FilterConfig } from '../models/filter-config'
import { type IntFilter } from '../models/int-filter'
import type { StringFilter } from '../models/string-filter'

export function toFilter(filterConfig: FilterConfig): StringFilter | IntFilter {
  const filter: StringFilter | IntFilter = {
    [filterConfig.type as 'contains']: filterConfig.value,
  }

  if (filterConfig.caseSensitive !== undefined) {
    filter.caseSensitive = filterConfig.caseSensitive
  }
  if (filterConfig.notMode !== undefined) {
    filter.notMode = filterConfig.notMode
  }

  return filter
}
