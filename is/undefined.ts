/**
 * Returns `true` if the given value is undefined, `false` otherwise.
 *
 * @param {unknown} val - The value to check.
 * @returns {boolean} `true` if the given value is undefined, `false` otherwise.
 */
export function isUndefined(val: unknown): val is undefined {
  return val === undefined
}
