/**
 * Returns `true` if the given value is null, `false` otherwise.
 *
 * @param {unknown} val - The value to check.
 * @returns {boolean} `true` if the given value is null, `false` otherwise.
 */
export function isNull(val: unknown): val is null {
  return val === null
}
