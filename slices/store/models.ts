import * as v from 'valibot'

/**
 * BaseStore
 */

export const baseStoreSchema = v.object({
  name: v.string(),
  description: v.string(),
  data: v.any(),
})

export type Store = v.InferOutput<typeof createStoreSchema>

/**
 * CreateStoreSchema
 */

export const createStoreSchema = baseStoreSchema

export type CreateStore = v.InferOutput<typeof createStoreSchema>

/**
 * UpdateStoreSchema
 */

export const updateStoreSchema = baseStoreSchema

export type UpdateStoreSchema = v.InferOutput<typeof updateStoreSchema>
