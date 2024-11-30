import type { Dcservice, DcserviceCreateInput } from '../models'
import { baseUrl } from './constants'

export const NAME = 'create'

export const url = `${baseUrl}/${NAME}`

export type RequestParams = {
  input: DcserviceCreateInput
}

export type Result = Dcservice
