import type { Equals } from './any/equals'
import type { Boolean } from './boolean/_internal'

/**
 * Test should pass
 */
export type Pass = 1

/**
 * Test should fail
 */
export type Fail = 0

/**
 * Check or test the validity of a type
 * @param debug to debug with parameter hints (`ctrl+p`, `ctrl+shift+space`)
 * @example
 * ```ts
 * // see in `tst` folder
 * ```
 */
export function check<Type, Expect, Outcome extends Boolean>(debug?: Type): Equals<Equals<Type, Expect>, Outcome> {
  return undefined as any
}

/**
 * Validates a batch of [[check]]
 * @param checks a batch of [[check]]
 * @example
 * ```ts
 * // see in `tst` folder
 * ```
 */
export declare function checks(checks: 1[]): void
