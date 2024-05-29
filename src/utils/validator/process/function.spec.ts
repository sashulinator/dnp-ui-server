import { isPromise } from '~/utils/core'

import { assertArray } from '../default/assert-array'
import { assertEqual } from '../default/assert-equal'
import { assertObject } from '../default/assert-object'
import { assertRequired } from '../default/assert-required'
import { ValidationError, createError } from '../default/create-error'
import { Context } from '../types'
import { processFunction } from './function'

describe(`processFunction`, () => {
  const context: Context<ValidationError[], ValidationError> = {
    errorCollection: [],
    getInitialErrorCollection: () => [],
    assertEqual,
    assertArray,
    assertRequired,
    assertObject,
    createError,
    isErrorCollectionAllowed: true,
    collectError: (validationError, ctx): void => {
      ctx.errorCollection.push(validationError)
    },
  }

  beforeEach(() => {
    context.errorCollection = []
  })

  it(`throw error sync`, () => {
    const fn = () => {
      throw new Error('message')
    }
    const input = 'value'
    const ret = processFunction(fn, input, { name: 'name', path: ['testPath'], input }, context)

    expect(ret).toEqual({
      code: 'name',
      input: 'value',
      name: 'name',
      message: 'message',
      path: ['testPath'],
    })
  })

  it(`throw error async`, async () => {
    const fn = async () => {
      throw new Error('message')
    }
    const input = 'value'
    const promise = processFunction<ValidationError[], ValidationError>(
      fn,
      input,
      { name: 'name', path: ['testPath'], input },
      context
    )
    expect(isPromise(promise)).toBeTruthy()
    const ret = await promise
    expect(ret).toEqual({
      code: 'name',
      input: 'value',
      name: 'name',
      message: 'message',
      path: ['testPath'],
    })
  })

  it(`return errorCollection sync`, () => {
    const errorCollection = [{ message: 'errorMessage' }] as ValidationError[]
    const fn = () => errorCollection
    const input = 'string'

    const ret = processFunction<ValidationError[], ValidationError>(
      fn,
      input,
      { name: 'name', path: ['testPath'], input },
      context
    )
    expect(ret).toBe(errorCollection)
  })

  it(`return errorCollection async`, async () => {
    const errorCollection = [{ message: 'errorMessage' }] as ValidationError[]
    const fn = async () => errorCollection
    const input = 'string'
    const promise = processFunction<ValidationError[], ValidationError>(
      fn,
      input,
      { name: 'name', path: ['testPath'], input },
      context
    )
    expect(isPromise(promise)).toBeTruthy()
    const ret = await promise
    expect(ret).toBe(errorCollection)
  })

  it(`returns undefined sync`, () => {
    const fn = () => undefined
    const input = 'string'
    const result = processFunction(fn, input, { name: 'name', path: ['testPath'], input }, context)
    expect(result).toBeUndefined()
  })

  it(`returns undefined async`, async () => {
    const fn = async () => undefined
    const input = 'string'
    const promise = processFunction(fn, input, { name: 'name', path: ['testPath'], input }, context)
    expect(isPromise(promise)).toBeTruthy()
    const ret = await promise
    expect(ret).toBeUndefined()
  })
})
