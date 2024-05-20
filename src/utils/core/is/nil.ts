/**
 * Returns `true` if the given value is nil, `false` otherwise.
 *
 * @param {unknown} val - The value to check.
 * @returns {boolean} `true` if the given value is nil, `false` otherwise.
 */
export function isNil(val: unknown): val is null | undefined {
  return val === null || val === undefined
}
