import { assertArray } from '../assertions/array'
import { assertObject } from '../assertions/object'
import { isObject, isPromise } from '../core'
import { assertEqual } from './default/assert-equal'
import { assertRequired } from './default/assert-required'
import { only } from './only'
import { processFactory } from './process/process'
import { Context, ISAV, Meta, ToValidator } from './types'

/**
 * SUPER AWESOME VALIDATOR
 */
export class SuperAwesomeValidator<EC, VE> implements ISAV<EC, VE> {
  collectError: (validationError: VE, ctx: Context<EC, VE>, meta: Meta) => void
  createError: (error: unknown, meta: Meta, ctx: Context<EC, VE>) => VE
  assertArray: (input: unknown, meta: Meta, context: Context<EC, VE>) => asserts input is unknown[]
  assertObject: (input: unknown, meta: Meta, context: Context<EC, VE>) => asserts input is Record<string, unknown>
  assertRequired: <T>(input: T | undefined, meta: Meta, context: Context<EC, VE>) => asserts input is T
  assertEqual: <T>(input: unknown, compare: T, meta: Meta, context: Context<EC, VE>) => asserts input is T

  getInitialErrorCollection: () => EC

  constructor(config: Partial<ISAV<EC, VE>> & Pick<ISAV<EC, VE>, 'createError' | 'collectError'>) {
    this.collectError = config?.collectError

    this.createError = config?.createError

    this.assertArray = config?.assertArray ?? assertArray

    this.assertObject = config?.assertObject ?? assertObject

    this.assertRequired = config?.assertRequired ?? assertRequired

    this.assertEqual = config?.assertEqual ?? assertEqual

    const setInitialErrorCollection = () => [] as EC
    this.getInitialErrorCollection = config?.getInitialErrorCollection ?? setInitialErrorCollection
  }

  private createMeta(input: unknown, predefinedMeta?: Partial<Meta>): Meta {
    return { initialInput: input, input, name: '', path: [], ...predefinedMeta }
  }

  private createContext(predefinedContext?: Partial<Context<EC, VE>>): Context<EC, VE> {
    return {
      isErrorCollectionAllowed: true,
      errorCollection: predefinedContext?.errorCollection ?? this.getInitialErrorCollection(),
      getInitialErrorCollection: this.getInitialErrorCollection,
      collectError: this.collectError,
      createError: this.createError,
      assertArray: this.assertArray,
      assertRequired: this.assertRequired,
      assertEqual: this.assertEqual,
      assertObject: this.assertObject,
      ...predefinedContext,
    }
  }

  private getResult(ret: unknown, context: Context<EC, VE>, isReturnErrorList: boolean, isAsync: boolean) {
    if (isReturnErrorList) {
      return ret
    } else {
      if (isAsync && isPromise(ret)) {
        return ret.then(() => context.errorCollection)
      } else {
        return context.errorCollection
      }
    }
  }

  wrap<TSchema>(schema: TSchema) {
    const validator = (
      input: unknown,
      predefinedMeta?: Partial<Meta>,
      predefinedContext?: Partial<Context<EC, VE>>,
      isReturnErrorList = false,
      isAsync = false,
    ): EC => {
      const meta = this.createMeta(input, predefinedMeta)
      const context = this.createContext(predefinedContext)
      const ret = processFactory(schema, input, meta, context)
      // @ts-ignore
      return this.getResult(ret, context, isReturnErrorList, isAsync)
    }

    if (isObject(schema) || typeof schema === 'function') {
      Object.entries(schema).forEach(([schemaKey, schemaValue]) => {
        Object.defineProperty(validator, schemaKey, {
          value: this.wrap(schemaValue),
          writable: true,
          enumerable: true,
        })
      })
    }

    const asyncValidation = async (
      input: unknown,
      pmeta?: Partial<Meta>,
      pcontext?: Partial<Context<EC, VE>>,
      isReturnErrorList = false,
    ): Promise<EC> => {
      return validator(input, pmeta, pcontext, isReturnErrorList, true)
    }

    Object.defineProperty(validator, 'async', {
      value: asyncValidation,
      writable: true,
      enumerable: false,
    })

    // prettier-ignore
    return validator as typeof validator &
      ToValidator<TSchema> & 
      { async: typeof asyncValidation }
  }

  // TODO рефакторинг: сильно повторяет логику wrap
  only<TSchema extends Record<string, unknown>>(schema: TSchema) {
    const validator = (
      input: unknown,
      predefinedMeta?: Partial<Meta>,
      predefinedContext?: Partial<Context<EC, VE>>,
      isReturnErrorList = false,
      isAsync = false,
    ): EC => {
      const meta = this.createMeta(input, predefinedMeta)
      const context = this.createContext(predefinedContext)
      const ret = only(schema)(input, meta, context)
      // @ts-ignore
      return this.getResult(ret, context, isReturnErrorList, isAsync)
    }

    if (isObject(schema) || typeof schema === 'function') {
      Object.entries(schema).forEach(([schemaKey, schemaValue]) => {
        Object.defineProperty(validator, schemaKey, {
          value: this.wrap(schemaValue),
          writable: true,
          enumerable: true,
        })
      })
    }

    const asyncValidation = async (
      input: unknown,
      pmeta?: Partial<Meta>,
      pcontext?: Partial<Context<EC, VE>>,
      isReturnErrorList = false,
    ): Promise<EC> => {
      return validator(input, pmeta, pcontext, isReturnErrorList, true)
    }

    Object.defineProperty(validator, 'async', {
      value: asyncValidation,
      writable: true,
      enumerable: false,
    })

    // prettier-ignore
    return validator as typeof validator &
      ToValidator<TSchema> & 
      { async: typeof asyncValidation }
  }
}
