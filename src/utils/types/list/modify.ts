import type { At } from '../any/at'
import type { Cast } from '../any/cast'
import type { x } from '../any/x'
import type { Replace } from '../union/replace'
import type { List } from './list'

/**
 * Modify `L` with `LMod` & the [[x]] placeholder
 * @param L to copy from
 * @param LMod to copy to
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
export type Modify<L extends List, LMod extends List> = Cast<
  {
    [K in keyof LMod]: Replace<LMod[K], x, Exclude<At<L, K>, undefined>>
  },
  List
>
