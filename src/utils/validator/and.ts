import { isEmpty, isPromise } from '../core'
import { processFactory } from './process/process'
import { Context, Meta } from './types'

export function and(...schemas: unknown[]) {
  return function emit<EC, VE>(input: unknown, meta: Meta, context: Context<EC, VE>): unknown {
    const promises: Promise<unknown>[] = []
    const results: unknown[] = []

    for (let index = 0; index < schemas.length; index += 1) {
      const schema = schemas[index]

      const ret = processFactory(schema, input, meta, context)

      if (isPromise(ret)) {
        promises.push(ret)
      } else if (ret !== undefined) {
        results.push(ret)
      }
    }

    if (promises.length > 0) {
      return Promise.all(promises).then((resolvedResults) => {
        for (let i = 0; i < resolvedResults.length; i += 1) {
          const resolvedResult = resolvedResults[i]
          if (resolvedResult !== undefined) {
            results.push(resolvedResult)
          }
        }
        return results.length > 0 ? results : undefined
      })
    } else {
      return results.length > 0 ? results : undefined
    }
  }
}
