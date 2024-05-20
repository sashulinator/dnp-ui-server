/**
 * Checks that the given value is not null.
 *
 * @template T - The type of the value being checked.
 * @param {T | null} val - The value to check.
 * @param {string} [msg] - An optional error message to include if the check fails.
 * @throws {Error} if the value is null.
 */
export function assertNotNull<T>(val: T | null, msg?: string): asserts val is T {
  if (val === null) {
    throw new Error(msg || 'Value cannot be null.')
  }
}
