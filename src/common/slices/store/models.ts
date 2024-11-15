import * as v from 'valibot'

/**
 * BaseStore
 */

export const baseStoreSchema = v.object({
  name: v.string(),
  description: v.string(),
  data: v.looseObject({}),
})

/**
 * CreateStoreSchema
 */

export const createStoreSchema = baseStoreSchema

export type CreateStoreSchema = v.InferOutput<typeof createStoreSchema>

/**
 * UpdateStoreSchema
 */

export const updateStoreSchema = baseStoreSchema

export type UpdateStoreSchema = v.InferOutput<typeof updateStoreSchema>
