import { AssertionProps } from '~/utils/assertions'
import { isObject } from '~/utils/core'
import { BaseError } from '~/utils/error'

/**
 * Checks that the given value is an object.
 *
 * @param {unknown} value - The value to check.
 * @param {AssertionProps | undefined} [errorProps] - An optional error message to include if the check fails.
 * @throws {Error} if the value is not an object.
 */
export function assertObject(value: unknown, errorProps?: AssertionProps | undefined): asserts value is number {
  if (!isObject(value)) {
    const defaultMessage = 'Value is not an object.'
    const defaultCode = 'ERROR_ASRT_OBJECT'

    throw new BaseError(errorProps?.message || defaultMessage, { code: defaultCode, ...errorProps })
  }
}
