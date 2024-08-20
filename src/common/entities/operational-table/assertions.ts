import * as v from 'valibot'
import { type TableSchema, tableSchemaSchema } from './models'
import { BaseError } from '~/utils/error'

export function isTableSchema(input: unknown): input is TableSchema {
  const { issues } = v.safeParse(tableSchemaSchema, input)
  return !!issues
}

export function assertTableSchema(input: unknown, message?: string): asserts input is TableSchema {
  const { issues } = v.safeParse(tableSchemaSchema, input)
  if (!issues) return
  throw new BaseError(message ?? "Is not a type 'TableSchema'.", { errors: issues })
}
