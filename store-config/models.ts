import * as v from 'valibot'

/**
 * JDBCData
 */

export const jdbsDataSchema = v.object({
  host: v.pipe(v.string(), v.nonEmpty()),
  port: v.pipe(v.string(), v.nonEmpty()),
  database: v.pipe(v.string(), v.nonEmpty()),
  username: v.pipe(v.string(), v.nonEmpty()),
  password: v.pipe(v.string(), v.nonEmpty()),
})

export type JDBSData = v.InferOutput<typeof jdbsDataSchema>

/**
 * StoreConfig
 */

export const storeConfigSchema = v.object({
  keyname: v.pipe(v.string(), v.nonEmpty()),
  createdBy: v.pipe(v.string(), v.nonEmpty()),
  updatedBy: v.pipe(v.string(), v.nonEmpty()),
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  updatedAt: v.pipe(v.string(), v.nonEmpty()),
  type: v.pipe(v.string(), v.nonEmpty()),
  data: jdbsDataSchema,
})

export type StoreConfig = v.InferOutput<typeof storeConfigSchema>

/**
 * CreateStoreConfig
 */

export const createStoreConfigSchema = v.omit(storeConfigSchema, ['createdAt', 'createdBy', 'updatedAt', 'updatedBy'])

export type CreateStoreConfig = v.InferOutput<typeof createStoreConfigSchema>

/**
 * UpdateStoreConfig
 */

export const updateStoreConfigSchema = v.omit(storeConfigSchema, ['createdAt', 'createdBy'])

export type UpdateStoreConfig = v.InferOutput<typeof updateStoreConfigSchema>
