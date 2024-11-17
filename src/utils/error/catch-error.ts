export function catchError<E = unknown, T = unknown>(cb: () => T): [E, null] | [null, T] {
  try {
    return [null, cb()]
  } catch (e) {
    return [e as E, null]
  }
}

export async function asyncCatchError<E = unknown, T = unknown>(promise: Promise<T>): Promise<[E, null] | [null, T]> {
  try {
    return [null, await promise]
  } catch (e) {
    return [e as E, null]
  }
}
