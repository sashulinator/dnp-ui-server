import { handleError } from '../lib/handle-error'
import { tryCatch } from '../lib/try-catch'
import { Context, Meta } from '../types'

export function processFunction<EC, VE>(
  fn: (input: unknown, meta: Meta, context: Context<EC, VE>, isReturnErrorList: boolean) => unknown | Promise<unknown>,
  input: unknown,
  meta: Meta,
  context: Context<EC, VE>
): unknown | Promise<unknown> /** Error Collection */ {
  const ret = tryCatch(
    () => fn(input, meta, context, true),
    (error) => handleError(error, meta, context)
  )
  return ret
}
