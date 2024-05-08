import { isError } from '../is/error';

export function assertError(input: unknown): asserts input is Error {
  if (!isError(input)) {
    throw input;
  }
}
