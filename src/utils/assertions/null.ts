import { BaseError } from '../error'
import { AssertionProps } from './types/assertion-props'

/**
 * Checks that the given value is null.
 *
 * @param {unknown} val - The value to check.
 * @param {AssertionProps | undefined} [errorProps] - An optional error props to include if the check fails.
 * @throws {Error} if the value is defined.
 */
export function assertNull(val: unknown | null, errorProps?: AssertionProps | undefined): asserts val is null {
  if (typeof val !== null) {
    const defaultMessage = 'Value is not null.'
    const defaultCode = 'assertNull'

    throw new BaseError(errorProps?.message || defaultMessage, { code: defaultCode, ...errorProps })
  }
}
