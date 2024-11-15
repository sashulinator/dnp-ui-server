import * as v from 'valibot'

import { crudableModel } from '../../slices/crud/models/crudable'
import { getKeys } from '../../slices/dictionary'
import {
  columnSchema as tableColumnSchema,
  relationSchema as tableRelationSchema,
  tableSchema as tableTableSchema,
} from '../../slices/table'
import { userSchema } from '../user'

/**
 * BaseRawTable
 */

export const baseRawTableSchema = v.object({
  ...tableTableSchema.entries,
  // meta
  ...crudableModel.entries,
})

export type BaseRawTable = v.InferOutput<typeof baseRawTableSchema>

/**
 * Relations
 */

export const rawTableRelationsSchema = v.object({
  createdBy: userSchema,
  updatedBy: userSchema,
})

export type RawTableRelations = v.InferOutput<typeof rawTableRelationsSchema>

/**
 * RawTable
 */

export const rawTableSchema = v.intersect([baseRawTableSchema, rawTableRelationsSchema])

export type RawTable = v.InferOutput<typeof rawTableSchema>

/**
 * CreateRawTable
 */

export const createRawTableSchema = v.omit(baseRawTableSchema, getKeys(crudableModel.entries))

export type CreateRawTable = v.InferOutput<typeof createRawTableSchema>

/**
 * UpdateRawTable
 */

export const updateRawTableSchema = v.omit(baseRawTableSchema, getKeys(crudableModel.entries))

export type UpdateRawTable = v.InferOutput<typeof updateRawTableSchema>

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

export const rowSchema = v.object({})

export type Row = v.InferOutput<typeof rowSchema>
