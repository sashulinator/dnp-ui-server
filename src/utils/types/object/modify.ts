import type { At } from '../any/at'
import type { x } from '../any/x'
import type { Exclude } from '../union/exclude'
import type { Replace } from '../union/replace'

/**
 * Modify `O` with `OMod` & the [[x]] placeholder
 * @param O to copy from
 * @param OMod to copy to
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Modify<O extends object, OMod extends object> = {
  [K in keyof OMod]: Replace<OMod[K], x, Exclude<At<O, K>, undefined>>
} & {}
