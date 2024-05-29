import { Context, Meta } from '../types'

export function handleError<EC, VE = unknown>(error: unknown, meta: Meta, context: Context<EC, VE>): VE {
  const validationError = context.createError(error, meta, context)

  if (context.isErrorCollectionAllowed) {
    context.collectError(validationError, context, meta)
  }

  return validationError
}
