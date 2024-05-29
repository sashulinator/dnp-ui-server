import { AssertionProps } from '~/utils/assertions'
import { BaseError } from '~/utils/error'

/**
 * Checks that the given value is an array.
 *
 * @param {unknown} value - The value to check.
 * @param {AssertionProps | undefined} [errorProps] - An optional error message to include if the check fails.
 * @throws {Error} if the value is not an array.
 */
export function assertArray(value: unknown, errorProps?: AssertionProps | undefined): asserts value is number {
  if (!Array.isArray(value)) {
    const defaultMessage = 'Value is not an array.'
    const defaultCode = 'ERROR_ASRT_ARRAY'

    throw new BaseError(errorProps?.message || defaultMessage, { code: defaultCode, ...errorProps })
  }
}
