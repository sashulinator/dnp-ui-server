import * as v from 'valibot'

import { crudableModel } from '~/common/slices/crud/models/crudable'

import { getKeys } from '../../slices/dictionary'
import { databaseTableModel, columnModel as workingTableColumnModel } from '../../slices/working-table'
import { userSchema } from '../user'

/**
 * BaseTargetTable
 */

export const baseTargetTableSchema = v.object({
  kn: v.string(),
  name: v.string(),
  nav: v.boolean(),
  tableName: v.string(),
  columns: v.array(v.lazy(() => columnSchema)),
  description: v.string(),
  defaultView: v.union([v.literal('tree'), v.literal('table')]),
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

export const createTargetTableSchema = v.omit(baseTargetTableSchema, getKeys(crudableModel.entries))

export type CreateTargetTable = v.InferOutput<typeof createTargetTableSchema>

/**
 * UpdateTargetTable
 */

export const updateTargetTableSchema = v.omit(baseTargetTableSchema, getKeys(crudableModel.entries))

export type UpdateTargetTable = v.InferOutput<typeof updateTargetTableSchema>

/**
 * TableSchema
 */

export const tableSchemaSchema = databaseTableModel

export type TableSchema = v.InferOutput<typeof tableSchemaSchema>

/**
 * TableSchemaItem
 */

export const columnSchema = workingTableColumnModel

export type Column = v.InferOutput<typeof columnSchema>

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
