export async function catchAsync<T>(fn: () => Promise<T>): Promise<[unknown, null] | [null, T]> {
  try {
    const ret = await fn()
    return [null, ret]
  } catch (err) {
    return [err, null]
  }
}
