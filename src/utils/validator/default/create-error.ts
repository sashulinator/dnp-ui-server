import { Context, Meta } from '../types'

export interface ValidationError {
  message: string
  code: string
  input: unknown
  name: string | number
  path: (string | number)[]
}

export function createError<CE>(error: unknown, meta: Meta, context: Context<CE, ValidationError>) {
  if (error instanceof Error) {
    const { message, name, ...restError } = error

    return {
      // TODO проверка на Примитив
      input: meta.input,
      // важно передавать message именно таким образом
      message: message || '',
      path: meta.path,
      name: meta.name,
      code: meta.name.toString(),
      ...restError,
    }
  }

  throw new Error("error' must be an instance of Error")
}
