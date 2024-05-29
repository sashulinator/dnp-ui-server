import { BaseError } from '../error'
import { AssertionProps } from './types/assertion-props'

/**
 * Checks that the given value is a string.
 *
 * @param {unknown} val - The value to check.
 * @param {AssertionProps | undefined} [errorProps] - An optional error props to include if the check fails.
 * @throws {Error} if the value is not string.
 */
export function assertString(val: unknown | null, errorProps?: AssertionProps | undefined): asserts val is string {
  if (typeof val !== 'string') {
    const defaultMessage = 'Value is not a string.'
    const defaultCode = 'ERROR_ASRT_STRING'

    throw new BaseError(errorProps?.message || defaultMessage, { code: defaultCode, ...errorProps })
  }
}
