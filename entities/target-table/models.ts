import * as v from 'valibot'

import { crudableModel } from '~/common/slices/crud/models/crudable'

import { getKeys } from '../../slices/dictionary'
import {
  columnSchema as tableColumnSchema,
  relationSchema as tableRelationSchema,
  tableSchema as tableTableSchema,
} from '../../slices/table'
import { userSchema } from '../user'

/**
 * BaseTargetTable
 */

export const baseTargetTableSchema = v.object({
  ...tableTableSchema.entries,
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
