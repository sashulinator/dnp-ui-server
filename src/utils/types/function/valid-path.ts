import type { At } from '../any/at'
import type { Cast } from '../any/cast'
import type { Extends } from '../any/extends'
import type { Key as AKey } from '../any/key'
import type { Iteration } from '../iteration/iteration'
import type { IterationOf } from '../iteration/iteration-of'
import type { Key } from '../iteration/key'
import type { Next } from '../iteration/next'
import type { Pos } from '../iteration/pos'
import type { Length } from '../list/length'
import type { List } from '../list/list'
import type { Update } from '../list/update'
import type { NonNullable } from '../union/non-nullable'

/**
 * @hidden
 */
type ValidatePath<O, Path extends List<AKey>, I extends Iteration> = Update<
  Path,
  Key<I>,
  [At<O & {}, Path[Pos<I>]>] extends [never] ? keyof O : Path[Pos<I>]
>

/**
 * @hidden
 */
type __ValidPath<O, Path extends List<AKey>, I extends Iteration = IterationOf<0>> = {
  0: __ValidPath<NonNullable<At<O & {}, Path[Pos<I>]>>, ValidatePath<O, Path, I>, Next<I>>
  1: Path
}[Extends<Pos<I>, Length<Path>>]

/**
 * @hidden
 */
export type _ValidPath<O extends object, Path extends List<AKey>> = __ValidPath<O, Path> extends infer X
  ? Cast<X, List<AKey>>
  : never

/**
 * Replaces invalid parts of a path with `never`
 * @param O to be inspected
 * @param Path to be validated
 * @returns [[Index]][]
 * @example
 * ```ts
 * import type {A, L, O} from 'ts-toolbelt'
 *
 * // Get a property in an object `o` at any depth with `path`
 * // `A.Cast<P, O.ValidPath<O, P>>` makes sure `path` is valid
 * const getAt = <
 * O extends object,
 * P extends L.List<A.Index>
 * >(o: O, path: A.Cast<P, O.ValidPath<O, P>>): O.Path<O, P> => {
 *     let valueAt = o
 *
 *     for (const p of path)
 *         valueAt = valueAt[p]
 *
 *     return valueAt as any
 * }
 *
 * const test0 = getAt({a: {b: {c: 1}}},          ['a', 'b'] as const) // {c: number}
 * const test1 = getAt({a: {b: {c: 1}}} as const, ['a', 'b'] as const) // {c: 1}
 * const test2 = getAt({a: {b: {c: 1}}},          ['x'] as const)      // error
 * ```
 */
export type ValidPath<O extends object, Path extends List<AKey>> = O extends unknown
  ? Path extends unknown
    ? _ValidPath<O, Path>
    : never
  : never
