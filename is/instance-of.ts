export function isInstanceOf<T extends new (...args: unknown[]) => unknown>(
  input: unknown,
  constructor: T
): input is InstanceType<T> {
  return input instanceof constructor
}
