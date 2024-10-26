import * as v from 'valibot'

import { crudableModel } from '../../../slices/crud/models/crudable'
import { getKeys } from '../../../slices/dictionary'
import { databaseTableModel, columnModel as workingTableColumnModel } from '../../../slices/working-table'
import { userSchema } from '../../user'

/**
 * BaseOperationalTable
 */

export const baseOperationalTableSchema = v.object({
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

export type BaseOperationalTable = v.InferOutput<typeof baseOperationalTableSchema>

/**
 * Relations
 */

export const operationalTableRelationsSchema = v.object({
  createdBy: userSchema,
  updatedBy: userSchema,
})

export type OperationalTableRelations = v.InferOutput<typeof operationalTableRelationsSchema>

/**
 * OperationalTable
 */

export const operationalTableSchema = v.intersect([baseOperationalTableSchema, operationalTableRelationsSchema])

export type OperationalTable = v.InferOutput<typeof operationalTableSchema>

/**
 * CreateOperationalTable
 */

export const createOperationalTableSchema = v.omit(baseOperationalTableSchema, getKeys(crudableModel.entries))

export type CreateOperationalTable = v.InferOutput<typeof createOperationalTableSchema>

/**
 * UpdateOperationalTable
 */

export const updateOperationalTableSchema = v.omit(baseOperationalTableSchema, getKeys(crudableModel.entries))

export type UpdateOperationalTable = v.InferOutput<typeof updateOperationalTableSchema>

/**
 * TableSchema
 */

export const tableSchemaSchema = v.intersect([
  databaseTableModel,
  v.object({
    defaultView: v.union([v.literal('tree'), v.literal('table')]),
  }),
])

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
    _status: v.string(),
  },
  v.string(),
)

export type Row = v.InferOutput<typeof rowSchema>
