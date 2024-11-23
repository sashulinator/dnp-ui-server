import type { Store, StoreUpdateInput } from '../models'

export const NAME = 'name'

export type RequestParams = {
  name: string
  input: StoreUpdateInput
}

export type Result = Store
