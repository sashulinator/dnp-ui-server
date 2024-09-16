/**
 * lib
 */

export { getStringFilterConfig } from './lib/get-string-filter-config'

/**
 * models
 */

export type { Where, ReplaceValueByFilter } from './models/where'
export type { BooleanFilter } from './models/boolean-filter'
export type { StringFilter } from './models/string-filter'
export type { IntFilter } from './models/int-filter'
export type { In } from './models/in'
export type { Match } from './models/match'
export type { MatchMode } from './models/match-mode'
export type { Comparison } from './models/comparison'

export { isContainsMatch, isEndsWithMatch, isStartsWithMatch } from './models/is'
