import * as v from 'valibot'

/**
 * StoreConfig
 */

export const StoreConfigSchema = v.object({
  keyName: v.pipe(v.string(), v.nonEmpty()),
  createdBy: v.pipe(v.string(), v.nonEmpty()),
  updatedBy: v.pipe(v.string(), v.nonEmpty()),
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  updatedAt: v.pipe(v.string(), v.nonEmpty()),
  type: v.pipe(v.string(), v.nonEmpty()),
  data: v.looseObject({}),
})

export type StoreConfig = v.InferOutput<typeof StoreConfigSchema>

/**
 * CreateStoreConfig
 */
export const createStoreConfigSchema = v.omit(StoreConfigSchema, ['createdAt', 'createdBy', 'updatedAt', 'updatedBy'])

export type CreateStoreConfig = v.InferOutput<typeof createStoreConfigSchema>

/**
 * UpdateStoreConfig
 */

export const updateStoreConfigSchema = v.omit(StoreConfigSchema, ['createdAt', 'createdBy'])

export type UpdateStoreConfig = v.InferOutput<typeof updateStoreConfigSchema>
