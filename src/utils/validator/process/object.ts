import { OBJECT_ANY_KEY } from '../constants/object-any-key'
import { Context, Meta } from '../types'
import { processStructuredInput } from './structured-input'
import { processStructuredSchema } from './structured-schema'

export function processObject<EC, VE>(
  schemaPart: Record<string, unknown>,
  input: unknown,
  meta: Meta,
  context: Context<EC, VE>
): unknown | Promise<unknown> {
  try {
    context.assertObject(input, meta, context)
  } catch (e) {
    const error = context.createError(e, meta, context)
    if (context.isErrorCollectionAllowed) {
      context.collectError(error, context, meta)
    }
    return error
  }

  if (schemaPart[OBJECT_ANY_KEY]) {
    if (Object.entries(schemaPart).length > 1) {
      throw new Error('Schema with "ANY_OBJECT_KEY" must contain only one value with this key')
    }
    return processStructuredInput(schemaPart[OBJECT_ANY_KEY], Object.entries(input), meta, context)
  } else {
    return processStructuredSchema(Object.entries(schemaPart), input, meta, context)
  }
}
