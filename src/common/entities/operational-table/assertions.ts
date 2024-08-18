import * as v from 'valibot'
import { type TableSchema, tableSchemaSchema } from './models'

export function isTableSchema(input: unknown): input is TableSchema {
  const { issues } = v.safeParse(tableSchemaSchema, input)
  return !!issues
}

export function assertTableSchema(input: unknown): asserts input is TableSchema {
  if (isTableSchema(input)) return
  throw new Error("Is not a type 'TableSchema'.")
}
