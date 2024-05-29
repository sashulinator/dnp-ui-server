import { assertUndefined as Undefined, assertInteger as integer, assertString as string } from '../assertions'
import { BaseError } from '../error'
import { and } from './and'
import { collectError } from './default/collect-error'
import { ValidationError, createError } from './default/create-error'
import { or } from './or'
import { SuperAwesomeValidator } from './sav'

const sav = new SuperAwesomeValidator<ValidationError[], ValidationError>({
  collectError,
  createError,
})

const id = string

const base = {
  id,
  xy: [integer],
  level: string,
}

const edge = sav.only({ id, index: integer })

const rulableEdge = sav.only({
  ...edge,
  rules: or([sav.only({ id, name: string, keyName: string })], Undefined),
})

const main = sav.only({
  ...base,
  children: or([sav.only({ id, index: integer })], Undefined),
})

const decisionPoint = sav.only({
  ...base,
  name: string,
  computation: (v) =>
    v !== 'parallel' && v !== 'successively' && new BaseError('Can be only `parallel` or `successively`'),
  children: or([rulableEdge], Undefined),
})

const arbitration = sav.only({
  ...base,
  name: string,
  children: or([edge], Undefined),
  maxOffers: or(integer, Undefined),
  sortDesc: or(string, Undefined),
  arbFormula: or(string, Undefined),
})

const controlGroup = sav.only({
  ...base,
  name: string,
  children: or([edge], Undefined),
  partitionType: or(string, Undefined),
  percentCg: id,
})

const offer = sav.only({
  ...base,
  name: string,
  offerId: id,
})

export const validator = sav.only({
  id,

  name: and(string),

  keyName: and(string),

  data: [or(main, arbitration, controlGroup, decisionPoint, offer)],
})

describe(`SAV real prod example 1`, () => {
  it(`basic`, () => {
    const errors = validator({
      id: 'idtest',
      keyName: 'test',
      name: 'test',
      data: [
        {
          xy: [0, -84],
          level: 'main',
          children: [
            {
              id: 'Ebf',
              index: 0,
            },
          ],
          id: 'CYO',
        },
        {
          xy: [500, -81],
          level: 'decisionPoint',
          children: [
            {
              id: 'R3w',
              index: 0,
              rules: [
                {
                  id: '18ef754a9b51dd5ee69908a55f0094dc',
                  name: 'ВСЕГДА ИСТИНА',
                  keyName: 'always_true',
                },
              ],
            },
          ],
          name: 'Принятие решения',
          id: 'Ebf',
          computation: 'successively',
        },
        {
          xy: [1500, -90],
          level: 'offer',
          name: 'Сообщение',
          offerId: 'd4b79d95193081e27f8763f02a0dfdec',
          id: 'Twu',
        },
        {
          xy: [1000, -73],
          level: 'controlGroup',
          children: [
            {
              id: 'Twu',
              index: 0,
            },
          ],
          name: 'Контрольная группа',
          id: 'R3w',
          partitionType: 'COUNTER',
        },
      ],
    })

    console.log('error', errors)

    // expect(errors).toEqual()
  })
})
