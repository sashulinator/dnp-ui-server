import { type Store } from '../models'

export const NAME = 'get-by-name'

export type RequestParams = {
  name: string
}

export type Result = Store
