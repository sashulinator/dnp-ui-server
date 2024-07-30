import type { Key } from '../../any/key'
import type { List } from '../../list/list'
import type { _Omit as _LOmit } from '../../list/omit'
import type { Tail } from '../../list/tail'
import type { BuiltIn } from '../../misc/builtIn'
import type { _ListOf } from '../list-of'
import type { _Omit as _OOmit } from '../omit'

/**
 * @hidden
 */
type OmitAt<O, Path extends List<Key>> = O extends BuiltIn
  ? O
  : Path extends [Key]
    ? O extends List
      ? _LOmit<O, Path[0]>
      : O extends object
        ? _OOmit<O, Path[0]>
        : O
    : {
        [K in keyof O]: K extends Path[0] ? OmitAt<O[K], Tail<Path>> : O[K]
      }

/**
 * Remove out of `O` the fields at `Path`
 * @param O to remove from
 * @param Path to be followed
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Omit<O extends object, Path extends List<Key>> = Path extends unknown ? OmitAt<O, Path> : never
