import { type Undefinable } from '~/utils/core'

import type { Comparison } from './comparison'
import type { In } from './in'
import type { Match } from './match'
import type { MatchMode } from './match-mode'

export type FilterConfig = Undefinable<MatchMode> & {
  type: Comparison | Match | In
  value: string | undefined
}
