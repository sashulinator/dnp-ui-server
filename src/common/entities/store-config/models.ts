import * as v from 'valibot'
import { getObjectKeys } from '../../lib/get-object-keys'
import { crudableSchema } from '../../models/crudable'
import { ioConfigSchema } from '../io-config/models'

/**
 * BaseStoreConfig
 */

export const baseStoreConfigSchema = v.object({
  kn: v.pipe(v.string(), v.nonEmpty()),
  type: v.union([v.literal('jdbc'), v.literal('s3')]),
  data: v.lazy(() => jdbsDataSchema),
  ...crudableSchema.entries,
})

export type BaseStoreConfig = v.InferOutput<typeof baseStoreConfigSchema>

/**
 * Relations
 */

export const storeConfigRelationsSchema = v.object({
  ioConfigs: ioConfigSchema,
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

export type JdbcData = v.InferOutput<typeof jdbsDataSchema>

/**
 * CreateStoreConfig
 */

export const createStoreConfigSchema = v.omit(baseStoreConfigSchema, getObjectKeys(crudableSchema.entries))

export type CreateStoreConfig = v.InferOutput<typeof createStoreConfigSchema>

/**
 * UpdateStoreConfig
 */

export const updateStoreConfigSchema = v.omit(baseStoreConfigSchema, getObjectKeys(crudableSchema.entries))

export type UpdateStoreConfig = v.InferOutput<typeof updateStoreConfigSchema>
