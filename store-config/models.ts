import * as v from 'valibot'

/**
 * BaseStoreConfig
 */

export const baseStoreConfigSchema = v.object({
  kn: v.pipe(v.string(), v.nonEmpty()),
  createdBy: v.pipe(v.string(), v.nonEmpty()),
  updatedBy: v.pipe(v.string(), v.nonEmpty()),
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  updatedAt: v.pipe(v.string(), v.nonEmpty()),
  type: v.pipe(v.string(), v.nonEmpty()),
  data: v.lazy(() => jdbsDataSchema),
})

export type BaseStoreConfig = v.InferOutput<typeof baseStoreConfigSchema>

/**
 * Relations
 */

export const storeConfigRelationsSchema = v.object({
  extends: baseStoreConfigSchema,
  extended: v.array(baseStoreConfigSchema),
})

export type StoreConfigRelations = v.InferOutput<typeof storeConfigRelationsSchema>

/**
 * StoreConfig
 */

export const storeConfigSchema = v.intersect([baseStoreConfigSchema, storeConfigRelationsSchema])

export type StoreConfig = v.InferOutput<typeof storeConfigSchema>

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
 * CreateStoreConfig
 */

export const createStoreConfigSchema = v.omit(baseStoreConfigSchema, [
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
])

export type CreateStoreConfig = v.InferOutput<typeof createStoreConfigSchema>

/**
 * UpdateStoreConfig
 */

export const updateStoreConfigSchema = v.omit(baseStoreConfigSchema, ['createdAt', 'createdBy'])

export type UpdateStoreConfig = v.InferOutput<typeof updateStoreConfigSchema>
