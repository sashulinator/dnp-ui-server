import { BaseError } from '../error'
import { AssertionProps } from './types/assertion-props'

/**
 * Checks that the given value is undefined.
 *
 * @param {unknown} val - The value to check.
 * @param {AssertionProps | undefined} [errorProps] - An optional error props to include if the check fails.
 * @throws {Error} if the value is defined.
 */
export function assertUndefined(
  val: unknown | null,
  errorProps?: AssertionProps | undefined
): asserts val is undefined {
  if (val !== undefined) {
    const defaultMessage = 'Value is defined.'
    const defaultCode = 'assertUndefined'

    throw new BaseError(errorProps?.message || defaultMessage, { code: defaultCode, ...errorProps })
  }
}
