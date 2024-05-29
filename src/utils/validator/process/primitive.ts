import { Context, Meta } from '../types'

export function processPrimitive<EC, VE>(
  schemaPart: boolean | string | number | bigint | symbol | undefined | null,
  input: unknown,
  meta: Meta,
  context: Context<EC, VE>
): unknown | Promise<unknown> {
  try {
    context.assertEqual(input, schemaPart, meta, context)
    return undefined
  } catch (e) {
    const error = context.createError(e, meta, context)
    if (context.isErrorCollectionAllowed) {
      context.collectError(error, context, meta)
    }
    return error
  }
}
