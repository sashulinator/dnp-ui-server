import * as v from 'valibot'
import { getObjectKeys } from '~/common/lib/get-object-keys'
import { crudableSchema } from '~/common/models/crudable'

/**
 * BaseTargetTable
 */

export const baseTargetTableSchema = v.object({
  kn: v.string(),
  name: v.string(),
  tableSchemaKn: v.string(),
  nav: v.boolean(),
  data: v.object({}),
  ...crudableSchema.entries,
})

export type BaseTargetTable = v.InferOutput<typeof baseTargetTableSchema>

/**
 * Relations
 */

export const targetTableRelationsSchema = v.object({})

export type TargetTableRelations = v.InferOutput<typeof targetTableRelationsSchema>

/**
 * TargetTable
 */

export const targetTableSchema = v.intersect([baseTargetTableSchema, targetTableRelationsSchema])

export type TargetTable = v.InferOutput<typeof targetTableSchema>

/**
 * CreateTargetTable
 */

export const createTargetTableSchema = v.omit(baseTargetTableSchema, getObjectKeys(crudableSchema.entries))

export type CreateTargetTable = v.InferOutput<typeof createTargetTableSchema>

/**
 * UpdateTargetTable
 */

export const updateTargetTableSchema = v.omit(baseTargetTableSchema, getObjectKeys(crudableSchema.entries))

export type UpdateTargetTable = v.InferOutput<typeof updateTargetTableSchema>
