import { isEmpty, isPromise } from '../core'
import { processFactory } from './process/process'
import { Context, Meta } from './types'

export function or(...schemas: unknown[]) {
  return function emit<EC, VE>(input: unknown, meta: Meta, context: Context<EC, VE>): unknown {
    const results: unknown[] = []
    const promises: Promise<unknown>[] = []

    for (let index = 0; index < schemas.length; index += 1) {
      const schema = schemas[index]

      const ret = processFactory(schema, input, meta, { ...context, isErrorCollectionAllowed: false })

      if (isPromise(ret)) {
        promises.push(ret)
      } else if (ret !== undefined) {
        results.push(ret)
      }
    }

    if (isEmpty(promises)) {
      if (results.length === schemas.length && context.isErrorCollectionAllowed) {
        _collectErrors(results, context, meta)
        return results
      }
      return undefined
    }

    return Promise.all(promises).then((resolvedResults) => {
      for (let i = 0; i < resolvedResults.length; i += 1) {
        const resolvedResult = resolvedResults[i]
        resolvedResult && results.push(resolvedResult)
      }

      if (results.length === schemas.length) {
        _collectErrors(results, context, meta)
        return results
      }
      return undefined
    })
  }
}

function _collectErrors<EC, VE>(errorOrErrors: unknown, context: Context<EC, VE>, meta: Meta) {
  if (Array.isArray(errorOrErrors)) {
    for (let index = 0; index < errorOrErrors.length; index++) {
      const error = errorOrErrors[index]
      _collectErrors(error, context, meta)
    }
  } else {
    context.collectError(errorOrErrors as VE, context, meta)
  }
}
