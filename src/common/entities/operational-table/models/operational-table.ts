import * as v from 'valibot'

import { crudableModel } from '../../../slices/crud/models/crudable'
import { getKeys } from '../../../slices/dictionary'
import {
  columnSchema as tableColumnSchema,
  relationSchema as tableRelationSchema,
  tableSchema as tableTableSchema,
} from '../../../slices/table'
import { userSchema } from '../../user'

/**
 * BaseOperationalTable
 */

export const baseOperationalTableSchema = v.object({
  ...tableTableSchema.entries,
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
 * relation
 */

const relationSchema = tableRelationSchema

export type Relation = v.InferOutput<typeof relationSchema>

/**
 * Column
 */

export const columnSchema = tableColumnSchema

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
