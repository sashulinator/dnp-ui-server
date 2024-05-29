import { isPromise } from '../core'
import { BaseError } from '../error'
import { AssertionProps } from './types/assertion-props'

/**
 * Checks that the given value is a Promise.
 *
 * @template T - The Promise type being checked.
 * @param {unknown} val - The value to check.
 * @param {AssertionProps | undefined} [errorProps] - An optional error props to include if the check fails.
 * @throws {Error} if the value is a Promise.
 */
export function assertPromise<T extends Promise<unknown>>(
  val: unknown,
  errorProps?: AssertionProps | undefined
): asserts val is T {
  if (!isPromise(val)) {
    const defaultMessage = 'Value is not a Promise.'
    const defaultCode = 'assertPromise'

    throw new BaseError(errorProps?.message || defaultMessage, { code: defaultCode, ...errorProps })
  }
}
