import * as v from 'valibot'

import { crudableModel } from '~/common/shared/crud/models/crudable'

import { getKeys } from '../../../shared/dictionary'
import { columnModel, databaseTableModel } from '../../../shared/working-table'
import { userSchema } from '../../user'

/**
 * BaseDictionaryTable
 */

export const baseDictionaryTableModel = v.object({
  kn: v.string(),
  name: v.string(),
  nav: v.boolean(),
  tableName: v.string(),
  tableSchema: v.lazy(() => tableSchemaModel),
  // meta
  ...crudableModel.entries,
})

export type BaseDictionaryTable = v.InferOutput<typeof baseDictionaryTableModel>

/**
 * Relations
 */

export const dictionaryTableRelationsModel = v.object({
  createdBy: userSchema,
  updatedBy: userSchema,
})

export type DictionaryTableRelations = v.InferOutput<typeof dictionaryTableRelationsModel>

/**
 * DictionaryTable
 */

export const dictionaryTableModel = v.intersect([baseDictionaryTableModel, dictionaryTableRelationsModel])

export type DictionaryTable = v.InferOutput<typeof dictionaryTableModel>

/**
 * CreateDictionaryTable
 */

export const createDictionaryTableModel = v.omit(baseDictionaryTableModel, getKeys(crudableModel.entries))

export type CreateDictionaryTable = v.InferOutput<typeof createDictionaryTableModel>

/**
 * UpdateDictionaryTable
 */

export const updateDictionaryTableModel = v.omit(baseDictionaryTableModel, getKeys(crudableModel.entries))

export type UpdateDictionaryTable = v.InferOutput<typeof updateDictionaryTableModel>

/**
 * TableSchema
 */

export const tableSchemaModel = v.intersect([
  databaseTableModel,
  v.object({
    defaultView: v.union([v.literal('tree'), v.literal('table')]),
  }),
])

export type TableSchema = v.InferOutput<typeof tableSchemaModel>

/**
 * TableSchemaItem
 */

export const tableSchemaItemModel = v.intersect([columnModel])

export type TableSchemaItem = v.InferOutput<typeof tableSchemaItemModel>

/**
 * Row
 */

export const rowSchema = v.objectWithRest({}, v.string())

export type Row = v.InferOutput<typeof rowSchema>
