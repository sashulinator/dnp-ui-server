import { isObject, isPromise } from '../core'
import { processFactory } from './process/process'
import { Context, Meta } from './types'

export function only(schema: Record<string, unknown>) {
  return <EC, VE>(input: unknown, meta: Meta, context: Context<EC, VE>) => {
    const ret = processFactory(schema, input, meta, context)

    if (isObject(input)) {
      const schemaEntries = Object.entries(schema)
      let inputKeys = Object.keys(input)

      for (let index = 0; index < schemaEntries.length; index += 1) {
        const [schemaKey] = schemaEntries[index]
        inputKeys = inputKeys.filter((inputKey) => inputKey !== schemaKey)
      }

      if (inputKeys.length) {
        const errors = _handleExtraKey(inputKeys, input, meta, context)

        if (isPromise(ret)) {
          return ret.then((resolvedResult) => [errors, resolvedResult])
        } else {
          return errors
        }
      }
    }

    return ret
  }
}

function _handleExtraKey<EC, VE>(
  inputKeys: string[],
  input: Record<string, unknown>,
  meta: Meta,
  context: Context<EC, VE>
): unknown[] {
  const errors: unknown[] = []

  for (let index = 0; index < inputKeys.length; index++) {
    const key = inputKeys[index]

    const error = context.createError(
      new Error('Extra key.'),
      { ...meta, inputObject: input, name: key, path: [...meta.path, key] },
      context
    )

    errors.push(error)

    if (context.isErrorCollectionAllowed) {
      context.collectError(error, context, meta)
    }
  }

  return errors
}
