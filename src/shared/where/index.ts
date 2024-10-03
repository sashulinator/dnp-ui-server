/**
 * lib
 */

export { toFilterConfig } from './lib/to-filter-config'
export { toFilter } from './lib/to-filter'

/**
 * models
 */

export { type Where, type ReplaceValueByFilter } from './models/where'
export { type BooleanFilter } from './models/boolean-filter'
export { type StringFilter } from './models/string-filter'
export { type IntFilter } from './models/int-filter'
export { type In, IN } from './models/in'
export { type MatchKey, MATCH } from './models/match'
export { type MatchMode, type MatchModeKey, MATCH_MODE } from './models/match-mode'
export { type ComparisonKey, COMPARISON } from './models/comparison'
export type { FilterConfig } from './models/filter-config'
export { type IsFilter, type IsKey, IS } from './models/is-filter'
