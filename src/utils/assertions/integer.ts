import { BaseError } from '../error'
import { AssertionProps } from './types/assertion-props'

/**
 * Checks that the given value is a integer.
 *
 * @param {unknown} val - The value to check.
 * @param {AssertionProps | undefined} [errorProps] - An optional error message to include if the check fails.
 * @throws {Error} if the value is not integer.
 */
export function assertInteger(val: unknown | null, errorProps?: AssertionProps | undefined): asserts val is number {
  if (typeof val !== 'number' || Number.isNaN(val)) {
    const defaultMessage = 'Value is not an integer.'
    const defaultCode = 'ERROR_ASRT_INTEGER'

    throw new BaseError(errorProps?.message || defaultMessage, { code: defaultCode, ...errorProps })
  }
}
