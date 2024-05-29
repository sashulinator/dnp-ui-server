import { assertInteger, assertString } from '../assertions'
import { isPromise } from '../core'
import { and } from './and'
import { assertArray } from './default/assert-array'
import { assertEqual } from './default/assert-equal'
import { assertObject } from './default/assert-object'
import { assertRequired } from './default/assert-required'
import { ValidationError, createError } from './default/create-error'
import { Context } from './types'

describe('and', () => {
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
    // @ts-ignore
    const arg2 = async (...args) => assertInteger(...args)
    const validator = and(arg1, arg2)

    const input = { username: 223 }
    const promise = validator(input, { name: 'name', path: ['testPath'], input }, context)

    expect(isPromise(promise)).toBeTruthy()

    const errors = await promise

    expect(errors).toEqual([
      {
        code: 'ERROR_ASRT_STRING',
        input: { username: 223 },
        message: 'Value is not a string.',
        name: 'name',
        path: ['testPath'],
      },
      {
        code: 'ERROR_ASRT_INTEGER',
        input: { username: 223 },
        message: 'Value is not an integer.',
        name: 'name',
        path: ['testPath'],
      },
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
        code: 'ERROR_ASRT_INTEGER',
        input: { username: 223 },
        message: 'Value is not an integer.',
        name: 'name',
        path: ['testPath'],
      },
    ])
  })

  it(`basic throw error`, () => {
    // @ts-ignore
    const arg1 = (...args) => assertString(...args)
    // @ts-ignore
    const arg2 = (...args) => assertInteger(...args)
    const validator = and(arg1, arg2)

    const input = { username: 223 }
    const errors = validator(input, { name: 'name', path: ['testPath'], input }, context)

    expect(errors).toEqual([
      {
        code: 'ERROR_ASRT_STRING',
        input: { username: 223 },
        message: 'Value is not a string.',
        name: 'name',
        path: ['testPath'],
      },
      {
        code: 'ERROR_ASRT_INTEGER',
        input: { username: 223 },
        message: 'Value is not an integer.',
        name: 'name',
        path: ['testPath'],
      },
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
        code: 'ERROR_ASRT_INTEGER',
        input: { username: 223 },
        message: 'Value is not an integer.',
        name: 'name',
        path: ['testPath'],
      },
    ])
  })
})
