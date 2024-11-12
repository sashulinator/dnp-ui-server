export function catchError<T, E extends Error = Error>(cb: () => T): [E, null] | [null, T] {
  try {
    return [null, cb()]
  } catch (e) {
    return [e, null]
  }
}

export async function asyncCatchError<T, E extends Error = Error>(promise: Promise<T>): Promise<[E, null] | [null, T]> {
  try {
    return [null, await promise]
  } catch (e) {
    return [e, null]
  }
}
