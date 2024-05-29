import { isPromise } from '~/utils/core'

export function tryCatch(
  tryer: () => unknown | Promise<unknown>,
  catcher: (e: Error) => unknown
): unknown | Promise<unknown> {
  try {
    const result = tryer()
    if (isPromise(result)) {
      return result.catch(catcher)
    }
    return result
  } catch (e) {
    return catcher(e as Error)
  }
}
