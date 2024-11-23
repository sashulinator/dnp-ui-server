import * as v from 'valibot'

/**
 * BaseStore
 */

export const storeSchema = v.object({
  name: v.string(),
  description: v.string(),
  data: v.looseObject({}),
})

export type Store = v.InferOutput<typeof storeSchema>

/**
 * UpdateStoreSchema
 */

export const storeUpdateInputSchema = storeSchema

export type StoreUpdateInput = v.InferOutput<typeof storeUpdateInputSchema>
