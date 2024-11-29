import { type Dcservice } from '../models'
import { baseUrl } from './constants'

export const NAME = 'get-by-id'

export const url = `${baseUrl}/${NAME}`

export type RequestParams = {
  id: string
}

export type Result = Dcservice
