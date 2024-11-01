import * as v from 'valibot'

import { BaseError } from '~/utils/error'

import { type Column, columnSchema } from '../models/dictionary-table'

export function isColumns(input: unknown): input is Column[] {
  const { issues } = v.safeParse(v.array(columnSchema), input)
  return !!issues
}

export function assertColumns(input: unknown, message?: string): asserts input is Column[] {
  const { issues } = v.safeParse(v.array(columnSchema), input)
  if (!issues) return
  throw new BaseError(message ?? "Is not a type 'TableSchema'.", { errors: issues })
}
