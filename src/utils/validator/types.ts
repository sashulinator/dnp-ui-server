import { Dictionary } from '../core'

export interface Meta {
  inputObject?: Record<string, unknown> | undefined
  // TODO: required
  initialInput?: unknown | undefined
  // TODO: undefined
  name: string | number
  input: unknown
  path: (string | number)[]
}

export interface Context<EC, VE> extends ISAV<EC, VE> {
  errorCollection: EC
  payload?: any
  isErrorCollectionAllowed: boolean
}

export interface ISAV<EC, VE> {
  getInitialErrorCollection: () => EC
  collectError: (validationError: VE, ctx: Context<EC, VE>, meta: Meta) => void
  createError: (error: unknown, meta: Meta, ctx: Context<EC, VE>) => VE
  assertArray: (input: unknown, meta: Meta, context: Context<EC, VE>) => asserts input is unknown[]
  assertRequired: <T>(input: T | undefined, meta: Meta, context: Context<EC, VE>) => asserts input is T
  assertObject: (input: unknown, meta: Meta, context: Context<EC, VE>) => asserts input is Record<string, unknown>
  assertEqual: <T>(input: unknown, compare: T, meta: Meta, context: Context<EC, VE>) => asserts input is T
}

export type ToSchema<T> = T extends Dictionary<any>
  ? { [K in keyof T]: ToSchema<T[K]> }
  : T extends unknown[]
    ? [ToSchema<ArrayElement<T>>]
    : T extends string
      ? Assertion | RegExp | string
      : T extends number
        ? Assertion | number
        : T extends RegExp
          ? Assertion
          : T

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never

export type Assertion = (input: unknown, meta: Meta, context: Context<unknown, unknown>) => unknown

export type EmitAssertion = (input: unknown) => unknown

export type MaybePromise<T> = Promise<T> | T

export type ToValidator<T> = T extends (...args: unknown[]) => unknown
  ? EmitAssertion
  : T extends unknown[]
    ? EmitAssertion
    : T extends string
      ? EmitAssertion
      : T extends number
        ? EmitAssertion
        : T extends Dictionary<any>
          ? { [K in keyof T]: ToValidator<T[K]> } & EmitAssertion
          : T
