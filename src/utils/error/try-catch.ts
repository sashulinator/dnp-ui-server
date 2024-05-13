import { assertError } from './assertions/error'

export function tryCatch<T, C>(tryer: () => T, catcher: (e: Error) => C) {
  try {
    return tryer()
  } catch (e) {
    assertError(e)
    return catcher(e)
  }
}
