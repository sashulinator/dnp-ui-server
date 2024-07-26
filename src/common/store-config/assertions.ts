import { safeParse } from 'valibot'
import { jdbsDataSchema, type JDBSData } from './models'
import { BaseError } from '~/utils/error'

export function isJDBCData(input: unknown): input is JDBSData {
  const { issues } = safeParse(jdbsDataSchema, input)
  return !issues
}

export function assertJDBCData(input: unknown): asserts input is JDBSData {
  const { issues } = safeParse(jdbsDataSchema, input)
  if (!issues) return
  throw new BaseError('Is not a type "JDBCData".', { errors: issues, input })
}
