import * as v from 'valibot'

/**
 * Store
 */

export const storeSchema = v.object({
  name: v.string(),
  description: v.string(),
  data: v.any(),
})

export type Store = v.InferOutput<typeof storeSchema>

/**
 * UpdateInput
 */

export const storeUpdateInputSchema = storeSchema

export type StoreUpdateInput = v.InferOutput<typeof storeUpdateInputSchema>
