/**
 * Checks that the given value is not null or undefined.
 *
 * @template T - The type of the value being checked.
 * @param {T | null | undefined} val - The value to check.
 * @param {string} [msg] - An optional error message to include if the check fails.
 * @throws {Error} if the value is null or undefined.
 */
export function assertNotNil<T>(val: T | null | undefined, msg?: string): asserts val is T {
  if (val === null || val === undefined) {
    throw new Error(msg || 'Value cannot be null or undefined.')
  }
}
