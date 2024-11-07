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
 * BaseDictionaryTable
 */

export const baseDictionaryTableSchema = v.object({
  ...tableTableSchema.entries,
  // meta
  ...crudableModel.entries,
})

export type BaseDictionaryTable = v.InferOutput<typeof baseDictionaryTableSchema>

/**
 * Relations
 */

export const dictionaryTableRelationsSchema = v.object({
  createdBy: userSchema,
  updatedBy: userSchema,
})

export type DictionaryTableRelations = v.InferOutput<typeof dictionaryTableRelationsSchema>

/**
 * DictionaryTable
 */

export const dictionaryTableSchema = v.intersect([baseDictionaryTableSchema, dictionaryTableRelationsSchema])

export type DictionaryTable = v.InferOutput<typeof dictionaryTableSchema>

/**
 * CreateDictionaryTable
 */

export const createDictionaryTableSchema = v.omit(baseDictionaryTableSchema, getKeys(crudableModel.entries))

export type CreateDictionaryTable = v.InferOutput<typeof createDictionaryTableSchema>

/**
 * UpdateDictionaryTable
 */

export const updateDictionaryTableSchema = v.omit(baseDictionaryTableSchema, getKeys(crudableModel.entries))

export type UpdateDictionaryTable = v.InferOutput<typeof updateDictionaryTableSchema>

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
