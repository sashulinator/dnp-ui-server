export function isError(input: unknown): input is Error {
  return input instanceof Error
}
