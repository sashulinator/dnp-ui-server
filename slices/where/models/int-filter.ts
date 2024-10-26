import type { OneKey } from '../../dictionary'
import type { ComparisonKey } from './comparison'
import type { In } from './in'
import type { IntMode } from './int-mode'

export type IntFilter = OneKey<In, number[]> | (OneKey<ComparisonKey, string> & IntMode)
