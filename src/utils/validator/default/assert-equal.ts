import { AssertionProps } from '~/utils/assertions'
import { BaseError } from '~/utils/error'

/**
 * Checks that the given value is an array.
 *
 * @param {unknown} value - The value to check.
 * @param {unknown} compare - The value to compare with.
 * @param {AssertionProps | undefined} [errorProps] - An optional error message to include if the check fails.
 * @throws {Error} if the value is not an array.
 */
export function assertEqual<T>(
  value: unknown,
  compare: T,
  errorProps?: AssertionProps | undefined
): asserts value is T {
  if (value !== compare) {
    const defaultMessage = 'Values are not equal.'
    const defaultCode = 'ERROR_ASRT_IQUAL'

    throw new BaseError(errorProps?.message || defaultMessage, {
      code: defaultCode,
      input2: compare,
      inputName: 'compare',
      ...errorProps,
    })
  }
}
