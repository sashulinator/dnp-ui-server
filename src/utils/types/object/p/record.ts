import type { Key } from '../../any/key'
import type { Iteration } from '../../iteration/iteration'
import type { IterationOf } from '../../iteration/iteration-of'
import type { Next } from '../../iteration/next'
import type { Pos } from '../../iteration/pos'
import type { LastKey } from '../../list/last-key'
import type { List } from '../../list/list'
import type { Modx } from '../_internal'

/**
 * @hidden
 */
type Record_RR<Path extends List<Key>, A, I extends Iteration = IterationOf<0>> = {
  readonly [Key in Path[Pos<I>]]: Pos<I> extends LastKey<Path> ? A : Record_RR<Path, A, Next<I>>
} & {}

/**
 * @hidden
 */
export type Record_RW<Path extends List<Key>, A, I extends Iteration = IterationOf<0>> = {
  [Key in Path[Pos<I>]]: Pos<I> extends LastKey<Path> ? A : Record_RW<Path, A, Next<I>>
} & {}

/**
 * @hidden
 */
type Record_OR<Path extends List<Key>, A, I extends Iteration = IterationOf<0>> = {
  readonly [Key in Path[Pos<I>]]?: Pos<I> extends LastKey<Path> ? A : Record_OR<Path, A, Next<I>>
} & {}

/**
 * @hidden
 */
type Record_OW<Path extends List<Key>, A, I extends Iteration = IterationOf<0>> = {
  [Key in Path[Pos<I>]]?: Pos<I> extends LastKey<Path> ? A : Record_OW<Path, A, Next<I>>
} & {}

/**
 * Create an object filled with `A` for the fields at the end of `Path`
 * @param Path to choose fields
 * @param A to fill fields with
 * @param modx (?=`['!', 'W']`) to set modifiers
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
export type Record<Path extends List<Key>, A, modx extends Modx = ['!', 'W']> = {
  '!': {
    R: Record_RR<Path, A>
    W: Record_RW<Path, A>
  }
  '?': {
    R: Record_OR<Path, A>
    W: Record_OW<Path, A>
  }
}[modx[0]][modx[1]]
