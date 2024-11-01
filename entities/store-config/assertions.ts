import { safeParse } from 'valibot'

import { BaseError } from '~/utils/error'

import { type JdbcData, jdbsDataSchema } from './models'

export function isJDBCData(input: unknown): input is JdbcData {
  const { issues } = safeParse(jdbsDataSchema, input)
  return !issues
}

export function assertJDBCData(input: unknown): asserts input is JdbcData {
  const { issues } = safeParse(jdbsDataSchema, input)
  if (!issues) return
  throw new BaseError('Is not a type "JDBCData".', { errors: issues, input })
}
