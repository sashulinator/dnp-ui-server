import * as v from 'valibot'
import { getObjectKeys } from '../_lib/get-object-keys'
import { crudableSchema } from '../_models/crudable'
import { baseStoreConfigSchema } from '../store-config'

/**
 * BaseIoConfig
 */

export const baseIoConfigSchema = v.object({
  kn: v.pipe(v.string(), v.nonEmpty()),
  type: v.union([v.literal('jdbc'), v.literal('s3')]),
  data: v.lazy(() => jdbsDataSchema),
  storeConfigKn: v.pipe(v.string(), v.nonEmpty()),
  ...crudableSchema.entries,
})

export type BaseIoConfig = v.InferOutput<typeof baseIoConfigSchema>

/**
 * Relations
 */

export const ioConfigRelationsSchema = v.object({
  storeConfig: v.lazy(() => baseStoreConfigSchema),
})

export type IoConfigRelations = v.InferOutput<typeof ioConfigRelationsSchema>

/**
 * IoConfig
 */

export const ioConfigSchema = v.intersect([baseIoConfigSchema, ioConfigRelationsSchema])

export type IoConfig = v.InferOutput<typeof ioConfigSchema>

/**
 * JDBCData
 */

export const jdbsDataSchema = v.object({
  table: v.pipe(v.string(), v.nonEmpty()),
})

export type JdbcData = v.InferOutput<typeof jdbsDataSchema>

/**
 * CreateIoConfig
 */

export const createIoConfigSchema = v.omit(baseIoConfigSchema, getObjectKeys(crudableSchema.entries))

export type CreateIoConfig = v.InferOutput<typeof createIoConfigSchema>

/**
 * UpdateIoConfig
 */

export const updateIoConfigSchema = v.omit(baseIoConfigSchema, getObjectKeys(crudableSchema.entries))

export type UpdateIoConfig = v.InferOutput<typeof updateIoConfigSchema>
