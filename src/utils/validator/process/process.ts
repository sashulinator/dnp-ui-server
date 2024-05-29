import { isObject } from '~/utils/core'

import { isKeyable } from '../lib/is-keyable'
import { isPrimitive } from '../lib/is-primitive'
import { Context, Meta } from '../types'
import { processArray } from './array'
import { processFunction } from './function'
import { processObject } from './object'
import { processPrimitive } from './primitive'

export function processFactory<EC, VE>(
  schema: unknown,
  input: unknown,
  meta: Meta,
  context: Context<EC, VE>
): unknown | Promise<unknown> {
  if (isPrimitive(schema)) {
    return processPrimitive(schema, input, meta, context)
  }

  if (isKeyable(schema)) {
    return processObject(schema as any, input, meta, context)
  }

  if (typeof schema === 'function') {
    return processFunction(schema as any, input, meta, context)
  }

  if (Array.isArray(schema)) {
    return processArray(schema, input, meta, context)
  }

  throw Error('Schema must be a primitive, function, array or object.')
}
