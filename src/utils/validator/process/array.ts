import { Context, Meta } from '../types'
import { processStructuredInput } from './structured-input'

export function processArray<EC, VE>(
  arraySchemaPart: unknown[],
  input: unknown,
  meta: Meta,
  context: Context<EC, VE>
): unknown | unknown /** Error Collection */ {
  context.assertArray(input, meta, context)

  if (arraySchemaPart.length > 1) {
    throw Error(
      'SchemaError.processArray: Array in a schema cannot have length more than 1. Maybe you want to use "or"?'
    )
  }

  return processStructuredInput(arraySchemaPart[0], Object.entries(input), meta, context)
}
