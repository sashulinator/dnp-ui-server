/**
 * Checks that the given value is an integer.
 *
 * @param {unknown} val - The value to check.
 */
export function isInteger(val: unknown | null): val is 1 {
  return typeof val === 'number' && !Number.isNaN(val)
}
