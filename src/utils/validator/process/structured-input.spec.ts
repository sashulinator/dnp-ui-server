import { isPromise } from '~/utils/core'
import { BaseError } from '~/utils/error'

import { assertArray } from '../default/assert-array'
import { assertEqual } from '../default/assert-equal'
import { assertObject } from '../default/assert-object'
import { assertRequired } from '../default/assert-required'
import { ValidationError, createError } from '../default/create-error'
import { Context } from '../types'
import { processStructuredInput } from './structured-input'

describe(`processStructure`, () => {
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
      if (ctx.errorCollection === undefined) ctx.errorCollection = []
      ctx.errorCollection.push(validationError)
    },
  }

  beforeEach(() => {
    context.errorCollection = []
  })

  it(`throw error sync`, () => {
    const structureSchemaPart = () => {
      throw new BaseError('Test', { code: 'testCode' })
    }
    const input: [[string, string]] = [['key', 'value']] // эквивалент { key: 'value' }
    const ret = processStructuredInput(structureSchemaPart, input, { name: 'name', path: ['testPath'], input }, context)

    expect(ret).toEqual([
      {
        input: 'value',
        message: 'Test',
        path: ['testPath', 'key'],
        name: 'key',
        code: 'testCode',
      },
    ])
  })

  it(`throw error async`, async () => {
    const structureSchemaPart = async () => {
      throw new BaseError('Test', { code: 'testCode' })
    }
    const input: [[string, string]] = [['key', 'value']] // эквивалент { key: 'value' }
    const promise = processStructuredInput(
      structureSchemaPart,
      input,
      { name: 'name', path: ['testPath'], input },
      context
    )

    expect(isPromise(promise)).toBeTruthy()
    const ret = await promise

    expect(ret).toEqual([
      {
        input: 'value',
        message: 'Test',
        path: ['testPath', 'key'],
        name: 'key',
        code: 'testCode',
      },
    ])
  })
})
