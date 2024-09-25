import * as v from 'valibot'

import { getObjectKeys } from '~/common/lib/get-object-keys'
import { crudableModel } from '~/common/shared/crud/models/crudable'

import { columnModel, databaseTableModel } from '../../shared/working-table'
import { userSchema } from '../user'

/**
 * BaseTargetTable
 */

export const baseTargetTableSchema = v.object({
  kn: v.string(),
  name: v.string(),
  nav: v.boolean(),
  tableName: v.string(),
  tableSchema: v.lazy(() => tableSchemaSchema),
  // meta
  ...crudableModel.entries,
})

export type BaseTargetTable = v.InferOutput<typeof baseTargetTableSchema>

/**
 * Relations
 */

export const targetTableRelationsSchema = v.object({
  createdBy: userSchema,
  updatedBy: userSchema,
})

export type TargetTableRelations = v.InferOutput<typeof targetTableRelationsSchema>

/**
 * TargetTable
 */

export const targetTableSchema = v.intersect([baseTargetTableSchema, targetTableRelationsSchema])

export type TargetTable = v.InferOutput<typeof targetTableSchema>

/**
 * CreateTargetTable
 */

export const createTargetTableSchema = v.omit(baseTargetTableSchema, getObjectKeys(crudableModel.entries))

export type CreateTargetTable = v.InferOutput<typeof createTargetTableSchema>

/**
 * UpdateTargetTable
 */

export const updateTargetTableSchema = v.omit(baseTargetTableSchema, getObjectKeys(crudableModel.entries))

export type UpdateTargetTable = v.InferOutput<typeof updateTargetTableSchema>

/**
 * TableSchema
 */

export const tableSchemaSchema = databaseTableModel

export type TableSchema = v.InferOutput<typeof tableSchemaSchema>

/**
 * TableSchemaItem
 */

export const tableSchemaItemSchema = columnModel

export type TableSchemaItem = v.InferOutput<typeof tableSchemaItemSchema>

/**
 * Row
 */

export const rowSchema = v.objectWithRest(
  {
    _id: v.string(),
  },
  v.string(),
)

export type Row = v.InferOutput<typeof rowSchema>
