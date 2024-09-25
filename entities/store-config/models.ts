import * as v from 'valibot'

import { crudableModel } from '../../shared/crud/models/crudable'
import { getKeys } from '../../shared/dictionary'
import { userSchema } from '../user'

/**
 * BaseStoreConfig
 */

export const baseStoreConfigSchema = v.object({
  kn: v.pipe(v.string(), v.nonEmpty()),
  type: v.union([v.literal('postgres'), v.literal('s3')]),
  data: v.lazy(() => jdbsDataSchema),
  ...crudableModel.entries,
})

export type BaseStoreConfig = v.InferOutput<typeof baseStoreConfigSchema>

/**
 * Relations
 */

export const storeConfigRelationsSchema = v.object({
  createdBy: userSchema,
  updatedBy: userSchema,
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
  username: v.pipe(v.string(), v.nonEmpty()),
  password: v.pipe(v.string(), v.nonEmpty()),
  host: v.pipe(v.string(), v.nonEmpty()),
  port: v.pipe(v.string(), v.nonEmpty()),
  dbName: v.pipe(v.string(), v.nonEmpty()),
})

export type JdbcData = v.InferOutput<typeof jdbsDataSchema>

/**
 * CreateStoreConfig
 */

export const createStoreConfigSchema = v.omit(baseStoreConfigSchema, getKeys(crudableModel.entries))

export type CreateStoreConfig = v.InferOutput<typeof createStoreConfigSchema>

/**
 * UpdateStoreConfig
 */

export const updateStoreConfigSchema = v.omit(baseStoreConfigSchema, getKeys(crudableModel.entries))

export type UpdateStoreConfig = v.InferOutput<typeof updateStoreConfigSchema>
