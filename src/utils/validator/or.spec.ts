import { assertString } from '../assertions'
import { isPromise } from '../core'
import { assertArray } from './default/assert-array'
import { assertEqual } from './default/assert-equal'
import { assertObject } from './default/assert-object'
import { assertRequired } from './default/assert-required'
import { ValidationError, createError } from './default/create-error'
import { or } from './or'
import { type Context } from './types'

describe('or', () => {
  const context: Context<ValidationError[], ValidationError> = {
    errorCollection: [],
    getInitialErrorCollection: () => [],
    assertArray,
    assertRequired,
    assertObject,
    createError,
    assertEqual,
    isErrorCollectionAllowed: true,
    collectError: (validationError, ctx): void => {
      if (ctx.errorCollection === undefined) ctx.errorCollection = []
      ctx.errorCollection.push(validationError)
    },
  }

  beforeEach(() => {
    context.errorCollection = []
  })

  it(`basic throw error async`, async () => {
    // @ts-ignore
    const arg1 = async (...args) => assertString(...args)
    const arg2 = {
      // @ts-ignore
      world: async (...args) => assertString(...args),
    }
    const validator = or(arg1, arg2)

    const input = { username: 223 }
    const promise = validator(input, { name: 'name', path: ['testPath'], input }, context)
    expect(isPromise(promise)).toBeTruthy()
    const erorrs = await promise

    expect(erorrs).toEqual([
      [
        {
          input: undefined,
          message: 'Value is required.',
          path: ['testPath', 'world'],
          name: 'world',
          code: 'ERROR_ASRT_REQUIRED',
        },
      ],
      {
        input,
        message: 'Value is not a string.',
        path: ['testPath'],
        name: 'name',
        code: 'ERROR_ASRT_STRING',
      },
    ])

    expect(context.errorCollection).toEqual([
      {
        input: undefined,
        message: 'Value is required.',
        path: ['testPath', 'world'],
        name: 'world',
        code: 'ERROR_ASRT_REQUIRED',
      },
      {
        input,
        message: 'Value is not a string.',
        path: ['testPath'],
        name: 'name',
        code: 'ERROR_ASRT_STRING',
      },
    ])
  })

  it(`basic throw error`, () => {
    const arg1 = assertString
    const arg2 = {
      world: assertString,
    }
    const validator = or(arg1, arg2)

    const input = { username: 223 }
    const errors = validator(input, { name: 'name', path: ['testPath'], input }, context)

    expect(errors).toEqual([
      {
        input,
        message: 'Value is not a string.',
        path: ['testPath'],
        name: 'name',
        code: 'ERROR_ASRT_STRING',
      },
      [
        {
          input: undefined,
          message: 'Value is required.',
          path: ['testPath', 'world'],
          name: 'world',
          code: 'ERROR_ASRT_REQUIRED',
        },
      ],
    ])

    expect(context.errorCollection).toEqual([
      {
        input,
        message: 'Value is not a string.',
        path: ['testPath'],
        name: 'name',
        code: 'ERROR_ASRT_STRING',
      },
      {
        input: undefined,
        message: 'Value is required.',
        path: ['testPath', 'world'],
        name: 'world',
        code: 'ERROR_ASRT_REQUIRED',
      },
    ])
  })
})
