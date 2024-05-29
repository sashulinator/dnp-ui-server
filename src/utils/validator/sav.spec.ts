import { assertString } from '../assertions'
import { collectError } from './default/collect-error'
import { ValidationError, createError } from './default/create-error'
import { only } from './only'
import { SuperAwesomeValidator } from './sav'

describe(`SAV`, () => {
  it(`basic`, () => {
    const sav = new SuperAwesomeValidator<ValidationError[], ValidationError>({
      collectError,
      createError,
    })

    const validator = sav.wrap({
      username: assertString,
    })

    const errors = validator({ username: 223 })

    expect(errors).toEqual([
      {
        code: 'ERROR_ASRT_STRING',
        input: 223,
        initialInput: { username: 223 },
        message: 'Value is not a string.',
        name: 'username',
        path: ['username'],
      },
    ])
  })

  it(`property validator`, () => {
    const sav = new SuperAwesomeValidator<ValidationError[], ValidationError>({
      collectError,
      createError,
    })

    const validator = sav.wrap({
      username: assertString,
    })

    const errors = validator.username(223)

    expect(errors).toEqual([
      {
        input: 223,
        message: 'Value is not a string.',
        path: [],
        name: '',
        code: 'ERROR_ASRT_STRING',
        initialInput: 223,
      },
    ])
  })

  it(`property validator`, () => {
    const sav = new SuperAwesomeValidator<ValidationError[], ValidationError>({
      collectError,
      createError,
    })
    const instance = sav.wrap({
      id: assertString,
      cretedBy: assertString,
      editedBy: assertString,
    })

    const networksSchema = {
      facebook: assertString,
    }

    const networksValidator = sav.wrap(networksSchema)

    const networkfacebookError = networksValidator.facebook(1)

    expect(networkfacebookError).toEqual([
      {
        input: 1,
        message: 'Value is not a string.',
        path: [],
        name: '',
        code: 'ERROR_ASRT_STRING',
        initialInput: 1,
      },
    ])

    const userValidator = sav.wrap({
      username: assertString,
      networks: networksSchema,
      ...instance,
    })

    const userFacebookErrors = userValidator.networks.facebook(223)

    expect(userFacebookErrors).toEqual([
      {
        input: 223,
        message: 'Value is not a string.',
        path: [],
        name: '',
        code: 'ERROR_ASRT_STRING',
        initialInput: 223,
      },
    ])

    const networksErrors = userValidator.networks(223)

    expect(networksErrors).toEqual([
      {
        input: 223,
        message: 'Value is not an object.',
        path: [],
        name: '',
        code: 'ERROR_ASRT_OBJECT',
        initialInput: 223,
      },
    ])
  })

  it(`get error from every value in object`, () => {
    type VError = { name: string | number; path: (string | number)[] }

    const sav = new SuperAwesomeValidator<VError[], VError>({
      collectError,
      createError: (e, meta) => {
        return { name: meta.name, path: meta.path }
      },
    })

    const instance = sav.wrap({
      id: assertString,
      createdBy: assertString,
      editedBy: assertString,
    })

    const networksValidator = sav.wrap({
      facebook: assertString,
    })

    const userValidator = sav.wrap({
      username: assertString,
      networks: networksValidator,
      ...instance,
    })

    const userError = userValidator({
      id: 1,
      createdBy: 2,
      editedBy: 3,
      networks: {
        facebook: 4,
      },
    })

    expect(userError).toEqual([
      { name: 'username', path: ['username'] },
      { name: 'facebook', path: ['networks', 'facebook'] },
      { name: 'id', path: ['id'] },
      { name: 'createdBy', path: ['createdBy'] },
      { name: 'editedBy', path: ['editedBy'] },
    ])
  })

  it(`get error primitive error`, () => {
    const sav = new SuperAwesomeValidator<ValidationError[], ValidationError>({
      collectError,
      createError,
    })

    const validator = sav.wrap({
      type: 'test',
    })

    validator({
      type: 'incorrect22222',
    })

    const errors = validator({
      type: 'incorrect',
    })

    expect(errors).toEqual([
      {
        input: 'incorrect',
        message: 'Values are not equal.',
        path: ['type'],
        name: 'type',
        code: 'ERROR_ASRT_IQUAL',
        input2: 'test',
        inputName: 'compare',
        initialInput: { type: 'incorrect' },
      },
    ])
  })

  it(`with only`, async () => {
    const sav = new SuperAwesomeValidator<ValidationError[], ValidationError>({
      collectError,
      createError,
    })

    const validator = sav.wrap(
      only({
        type: () => {
          throw Error('test error message')
        },
      }),
    )

    const errors = validator({ type: 'string', extraKey: 'extraValue' })

    expect(errors).toEqual([
      { code: 'type', input: 'string', message: 'test error message', name: 'type', path: ['type'] },
      {
        code: 'extraKey',
        input: { extraKey: 'extraValue', type: 'string' },
        message: 'Extra key.',
        name: 'extraKey',
        path: ['extraKey'],
      },
    ])
  })

  it(`with only async`, async () => {
    const sav = new SuperAwesomeValidator<ValidationError[], ValidationError>({
      collectError,
      createError,
    })

    const validator = sav.wrap(
      only({
        type: async () => {
          throw Error('test error message')
        },
      }),
    )

    const errors = await validator.async({ type: 'string', extraKey: 'extraValue' })

    expect(errors).toEqual([
      {
        input: { type: 'string', extraKey: 'extraValue' },
        message: 'Extra key.',
        path: ['extraKey'],
        name: 'extraKey',
        code: 'extraKey',
      },
      {
        input: 'string',
        message: 'test error message',
        path: ['type'],
        name: 'type',
        code: 'type',
      },
    ])
  })

  it(`basic throw error`, () => {
    const sav = new SuperAwesomeValidator<ValidationError[], ValidationError>({
      collectError,
      createError,
    })

    const validator = sav.only({
      hello: assertString,
    })

    const input = { username: 223 }
    const errors = validator(input)

    expect(errors).toEqual([
      {
        input: undefined,
        initialInput: { username: 223 },
        message: 'Value is required.',
        path: ['hello'],
        name: 'hello',
        code: 'ERROR_ASRT_REQUIRED',
      },
      {
        input: { username: 223 },
        // initialInput: { username: 223 },
        message: 'Extra key.',
        path: ['username'],
        name: 'username',
        code: 'username',
      },
    ])
  })
})
