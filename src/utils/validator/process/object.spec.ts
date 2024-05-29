import { assertString } from '~/utils/assertions'

import { OBJECT_ANY_KEY } from '../constants/object-any-key'
import { assertArray } from '../default/assert-array'
import { assertEqual } from '../default/assert-equal'
import { assertObject } from '../default/assert-object'
import { assertRequired } from '../default/assert-required'
import { ValidationError, createError } from '../default/create-error'
import { Context } from '../types'
import { processObject } from './object'

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
    const objSchema = {
      username: () => {
        throw new Error('not string')
      },
    }

    const input = {
      username: 34,
    }

    const result = processObject(objSchema, input, { name: 'name', path: ['testPath'], input }, context)

    expect(result).toEqual([
      {
        input: 34,
        message: 'not string',
        path: ['testPath', 'username'],
        name: 'username',
        code: 'username',
      },
    ])
  })

  it(`throw error sync if input is a function`, () => {
    const objSchema = {
      username: () => {
        throw new Error('not string')
      },
    }

    const input = () => {}

    const result = processObject(objSchema, input, { name: 'name', path: ['testPath'], input }, context)

    expect(result).toEqual({
      input,
      code: 'ERROR_ASRT_OBJECT',
      message: 'Value is not an object.',
      name: 'name',
      path: ['testPath'],
    })
  })

  it(`throw error sync if input is a function`, () => {
    const objSchema = {
      [OBJECT_ANY_KEY]: {
        id: assertString,
        username: assertString,
      },
    }

    const input = {
      vasya: {
        id: 45,
        username: 47,
      },
      petya: {
        id: 23,
        username: 33,
      },
    }

    const result = processObject(objSchema, input, { name: 'name', path: ['testPath'], input }, context)

    const error1 = {
      code: 'ERROR_ASRT_STRING',
      input: 45,
      message: 'Value is not a string.',
      name: 'id',
      path: ['testPath', 'vasya', 'id'],
    }
    const error2 = {
      code: 'ERROR_ASRT_STRING',
      input: 47,
      message: 'Value is not a string.',
      name: 'username',
      path: ['testPath', 'vasya', 'username'],
    }
    const error3 = {
      code: 'ERROR_ASRT_STRING',
      input: 23,
      message: 'Value is not a string.',
      name: 'id',
      path: ['testPath', 'petya', 'id'],
    }
    const error4 = {
      code: 'ERROR_ASRT_STRING',
      input: 33,
      message: 'Value is not a string.',
      name: 'username',
      path: ['testPath', 'petya', 'username'],
    }

    expect(result).toEqual([
      [error1, error2],
      [error3, error4],
    ])

    expect(context.errorCollection).toEqual([error1, error2, error3, error4])
  })
})
