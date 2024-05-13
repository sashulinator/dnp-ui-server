/**
 * Checks that the given value is not undefined.
 *
 * @template T - The type of the value being checked.
 * @param {T | undefined} val - The value to check.
 * @param {string} [msg] - An optional error message to include if the check fails.
 * @throws {Error} if the value is undefined.
 */
export function assertDefined<T>(val: T | undefined, msg?: string): asserts val is T {
  if (val === undefined) {
    throw new Error(msg || 'Value cannot be undefined.')
  }
}
