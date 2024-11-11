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
 * BaseBussinessTable
 */

export const baseBussinessTableSchema = v.object({
  storeConfigId: v.pipe(v.string(), v.nonEmpty()),
  ...tableTableSchema.entries,
  // meta
  ...crudableModel.entries,
})

export type BaseBussinessTable = v.InferOutput<typeof baseBussinessTableSchema>

/**
 * Relations
 */

export const bussinessTableRelationsSchema = v.object({
  createdBy: userSchema,
  updatedBy: userSchema,
})

export type BussinessTableRelations = v.InferOutput<typeof bussinessTableRelationsSchema>

/**
 * BussinessTable
 */

export const bussinessTableSchema = v.intersect([baseBussinessTableSchema, bussinessTableRelationsSchema])

export type BussinessTable = v.InferOutput<typeof bussinessTableSchema>

/**
 * CreateBussinessTable
 */

export const createBussinessTableSchema = v.omit(baseBussinessTableSchema, getKeys(crudableModel.entries))

export type CreateBussinessTable = v.InferOutput<typeof createBussinessTableSchema>

/**
 * UpdateBussinessTable
 */

export const updateBussinessTableSchema = v.omit(baseBussinessTableSchema, getKeys(crudableModel.entries))

export type UpdateBussinessTable = v.InferOutput<typeof updateBussinessTableSchema>

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
