import { type QueryFilter } from '../models'
import { baseUrl } from './constants'

export const NAME = 'find-with-total'

export const url = `${baseUrl}/${NAME}`

export type RequestParams = {
  skip?: number
  take?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderBy?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select?: any
}

export type Result = {
  items: QueryFilter[]
  total: number
}
