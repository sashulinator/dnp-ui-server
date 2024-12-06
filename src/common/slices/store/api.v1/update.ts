import type { Store, StoreUpdateInput } from '../models'
import { baseUrl } from './constants'

export const NAME = 'update'

export const url = `${baseUrl}/${NAME}`

export type RequestParams = {
  input: StoreUpdateInput
}

export type Result = Store
