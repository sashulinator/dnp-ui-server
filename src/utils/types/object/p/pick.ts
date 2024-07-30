import type { Key } from '../../any/key'
import type { List } from '../../list/list'
import type { _Pick as _LPick } from '../../list/pick'
import type { Tail } from '../../list/tail'
import type { BuiltIn } from '../../misc/builtIn'
import type { _ListOf } from '../list-of'
import type { _Pick as _OPick } from '../pick'

/**
 * @hidden
 */
type PickAt<O, Path extends List<Key>> = [] extends Path
  ? O
  : O extends BuiltIn
    ? O
    : O extends List
      ? _ListOf<{
          [K in keyof _OPick<O, Path[0]>]: PickAt<O[K], Tail<Path>>
        }>
      : O extends object
        ? {
            [K in keyof _OPick<O, Path[0]>]: PickAt<O[K], Tail<Path>>
          }
        : O

/**
 * Extract out of `O` the fields at `Path`
 * @param O to extract from
 * @param Path to be followed
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Pick<O extends object, Path extends List<Key>> = Path extends unknown ? PickAt<O, Path> : never
