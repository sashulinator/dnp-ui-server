import { has, isPromise } from '~/utils/core'

import { Context, Meta } from '../types'
import { processFactory } from './process'

export function processStructuredInput<EC, EV>(
  schema: unknown,
  structuredInput: [string | number, unknown][],
  meta: Meta,
  context: Context<EC, EV>
): unknown | Promise<unknown> {
  let results: unknown[] = []
  const promises: Promise<unknown>[] = []

  for (let index = 0; index < structuredInput.length; index += 1) {
    const [name, input] = structuredInput[index]
    const path = [...meta.path, name]
    const newMeta = { ...meta, name, path, input }

    const ret = processFactory(schema, input, newMeta, context)

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
