import * as v from 'valibot'

import { crudableModel } from '../../slices/crud/models/crudable'
import { getKeys } from '../../slices/dictionary'
import { databaseTableModel, columnModel as workingTableColumnModel } from '../../slices/working-table'
import { userSchema } from '../user'

/**
 * BaseDictionaryTable
 */

export const baseDictionaryTableSchema = v.object({
  kn: v.string(),
  display: v.string(),
  nav: v.boolean(),
  name: v.string(),
  columns: v.array(v.lazy(() => columnSchema)),
  description: v.string(),
  defaultView: v.union([v.literal('tree'), v.literal('table')]),
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
 * TableSchema
 */

export const tableSchema = v.intersect([
  databaseTableModel,
  v.object({
    defaultView: v.union([v.literal('tree'), v.literal('table')]),
  }),
])

export type TableSchema = v.InferOutput<typeof tableSchema>

/**
 * TableSchemaItem
 */

export const columnSchema = v.intersect([workingTableColumnModel])

export type Column = v.InferOutput<typeof columnSchema>

/**
 * Row
 */

export const rowSchema = v.objectWithRest({}, v.string())

export type Row = v.InferOutput<typeof rowSchema>
