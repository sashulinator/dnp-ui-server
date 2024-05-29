import { assertString } from '../assertions'
import { assertArray } from './default/assert-array'
import { assertEqual } from './default/assert-equal'
import { assertObject } from './default/assert-object'
import { assertRequired } from './default/assert-required'
import { ValidationError, createError } from './default/create-error'
import { only } from './only'
import { Context } from './types'

describe('only', () => {
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

  it(`basic throw error`, () => {
    const validator = only({
      hello: assertString,
    })

    const input = { username: 223 }
    const errors = validator(input, { name: 'name', path: ['testPath'], input }, context)

    expect(errors).toEqual([
      {
        input: { username: 223 },
        message: 'Extra key.',
        path: ['testPath', 'username'],
        name: 'username',
        code: 'username',
      },
    ])

    expect(context.errorCollection).toEqual([
      {
        input: undefined,
        message: 'Value is required.',
        path: ['testPath', 'hello'],
        name: 'hello',
        code: 'ERROR_ASRT_REQUIRED',
      },
      {
        input: { username: 223 },
        message: 'Extra key.',
        path: ['testPath', 'username'],
        name: 'username',
        code: 'username',
      },
    ])
  })
})
