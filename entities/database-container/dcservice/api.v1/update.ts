import type { Dcservice, DcserviceUpdateInput } from '../models'
import { baseUrl } from './constants'

export const NAME = 'update'

export const url = `${baseUrl}/${NAME}`

export type RequestParams = {
  input: DcserviceUpdateInput
}

export type Result = Dcservice
