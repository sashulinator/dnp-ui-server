import { type OneKey } from '../../dictionary'
import type { In } from './in'
import type { Match } from './match'
import type { MatchMode } from './match-mode'

export type StringFilter = OneKey<In, string[]> | (OneKey<Match, string> & MatchMode)
