/**
 * Determines whether a value is a promise.
 *
 * @param {unknown} val - The value to test.
 * @return {boolean} `true` if the value is an promise, `false` otherwise.
 */
export function isPromise<T>(input: unknown): input is Promise<T> {
  return (
    !!input && (typeof input === 'object' || typeof input === 'function') && typeof (input as any)?.then === 'function'
  )
}
