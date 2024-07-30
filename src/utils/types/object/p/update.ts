import type { Key } from '../../any/key'
import type { List } from '../../list/list'
import type { Tail } from '../../list/tail'
import type { Update as LUpdate } from '../../list/update'
import type { BuiltIn } from '../../misc/builtIn'
import type { _ListOf } from '../list-of'
import type { Record } from '../record'
import type { Update as OUpdate } from '../update'

/**
 * @hidden
 */
type UpdateAt<O, Path extends List<Key>, A> = O extends BuiltIn
  ? O
  : Path extends [Key]
    ? O extends List
      ? LUpdate<O, Path[0], A>
      : O extends object
        ? OUpdate<O, Path[0], A>
        : O
    : {
        [K in keyof O]: K extends Path[0] ? UpdateAt<O[K], Tail<Path>, A> : O[K]
      }

/**
 * Update in `O` the fields at `Path` with `A`
 * @param O to update
 * @param Path to be followed
 * @param A to update with
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Update<O extends object, Path extends List<Key>, A extends any> = Path extends unknown
  ? UpdateAt<O, Path, A>
  : never
