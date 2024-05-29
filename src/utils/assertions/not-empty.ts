import { BaseError } from '../error'
import { AssertionProps } from './types/assertion-props'

/**
 * Checks that the given value is not empty.
 *
 * @param {unknown} val - The value to check.
 * @param {AssertionProps | undefined} [errorProps] - An optional error props to include if the check fails.
 * @throws {Error} if the value is not empty.
 */
export function assertNotEmpty(val: unknown | null, errorProps?: AssertionProps | undefined): asserts val is object {
  // TODO не только пустая строка может быть
  if (val === '' || val === undefined) {
    const defaultMessage = 'Value cannot be empty.'
    const defaultCode = 'assertNotEmpty'

    throw new BaseError(errorProps?.message || defaultMessage, { code: defaultCode, ...errorProps })
  }
}
