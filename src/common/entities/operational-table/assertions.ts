import * as v from 'valibot'

import { BaseError } from '~/utils/error'

import { type TableSchema, tableSchemaSchema } from './models/operational-table'

export function isTableSchema(input: unknown): input is TableSchema {
  const { issues } = v.safeParse(tableSchemaSchema, input)
  return !!issues
}

export function assertTableSchema(input: unknown, message?: string): asserts input is TableSchema {
  const { issues } = v.safeParse(tableSchemaSchema, input)
  if (!issues) return
  throw new BaseError(message ?? "Is not a type 'TableSchema'.", { errors: issues })
}
