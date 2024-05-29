import { AssertionProps } from '~/utils/assertions'
import { BaseError } from '~/utils/error'

/**
 * Checks that the given value is not undefined.
 *
 * @param {unknown} value - The value to check.
 * @param {AssertionProps | undefined} [errorProps] - An optional error message to include if the check fails.
 * @throws {Error} if the value is not an array.
 */
export function assertRequired(
  value: unknown | null,
  errorProps?: AssertionProps | undefined
): asserts value is number {
  if (value === undefined) {
    const defaultMessage = 'Value is required.'
    const defaultCode = 'ERROR_ASRT_REQUIRED'

    throw new BaseError(errorProps?.message || defaultMessage, { code: defaultCode, ...errorProps })
  }
}
