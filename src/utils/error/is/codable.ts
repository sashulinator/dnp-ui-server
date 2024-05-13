import { Codable } from '../types/codable'

export function isCodable(input: unknown): input is Codable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(input as any).code
}
