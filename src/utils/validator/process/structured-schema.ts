import { has, isPromise } from '~/utils/core'

import { Context, Meta } from '../types'
import { processFactory } from './process'

export function processStructuredSchema<EC, EV>(
  structuredSchema: [string | number, unknown][],
  input: unknown,
  meta: Meta,
  context: Context<EC, EV>
): unknown | Promise<unknown> {
  let results: unknown[] = []
  const promises: Promise<unknown>[] = []

  for (let index = 0; index < structuredSchema.length; index += 1) {
    const [name, schema] = structuredSchema[index]
    const path = [...meta.path, name]
    const newInput = input?.[name]
    const newMeta = { ...meta, name, path, input: newInput }

    let ret: unknown
    if (has(input, name)) {
      ret = processFactory(schema, newInput, newMeta, context)
    } else {
      try {
        context.assertRequired(undefined, newMeta, context)
      } catch (e) {
        const error = context.createError(e, newMeta, context)
        if (context.isErrorCollectionAllowed) {
          context.collectError(error, context, newMeta)
        }
        ret = error
      }
    }
    if (isPromise(ret)) {
      promises.push(ret)
    } else if (ret !== undefined) {
      results.push(ret)
    }
  }

  if (promises.length > 0) {
    const promise = Promise.all(promises).then((resolvedResults) => {
      for (let index = 0; index < resolvedResults.length; index++) {
        const resolvedResult = resolvedResults[index]
        resolvedResult && results.push(resolvedResult)
      }
      return results.length > 0 ? results : undefined
    })
    return promise
  }

  return results.length > 0 ? results : undefined
}
