import type { QueryFilter, QueryFilterUpdateInput } from '../models'
import { baseUrl } from './constants'

export const NAME = 'update'

export const url = `${baseUrl}/${NAME}`

export type RequestParams = {
  input: QueryFilterUpdateInput
}

export type Result = QueryFilter
