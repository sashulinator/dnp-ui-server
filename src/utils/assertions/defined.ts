import { BaseError } from '../error'
import { AssertionProps } from './types/assertion-props'

/**
 * Checks that the given value is not undefined.
 *
 * @template T - The type of the value being checked.
 * @param {T | undefined} val - The value to check.
 * @param {AssertionProps | undefined} [errorProps] - An optional error props to include if the check fails.
 * @throws {Error} if the value is undefined.
 */
export function assertDefined<T>(val: T | undefined, errorProps?: AssertionProps | undefined): asserts val is T {
  if (val === undefined) {
    const defaultMessage = 'Value is undefined.'
    const defaultCode = 'assertDefined'

    throw new BaseError(errorProps?.message || defaultMessage, { code: defaultCode, ...errorProps })
  }
}
