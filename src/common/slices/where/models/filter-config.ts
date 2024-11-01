import { type Undefinable } from '~/utils/core'

import type { ComparisonKey } from './comparison'
import type { In } from './in'
import type { IsKey } from './is-filter'
import type { MatchKey } from './match'
import type { MatchMode } from './match-mode'

/**
 * Тот же самый Filter только в другом представлении.
 * Представление FilterConfig удобно для чтения и мутаций
 * Представление Filter удобно для построения запроса
 */
export type FilterConfig = Undefinable<MatchMode> & {
  type: ComparisonKey | MatchKey | In | IsKey
  value: string | null
}
