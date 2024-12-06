import { type Store } from '../models'
import { baseUrl } from './constants'

export const NAME = 'get-by-name'

export const url = `${baseUrl}/${NAME}`

export type RequestParams = {
  name: string
}

export type Result = Store
