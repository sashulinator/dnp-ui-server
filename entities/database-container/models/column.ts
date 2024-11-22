import * as v from 'valibot'

/**
 * BaseColumn
 */

export const baseColumnSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(v.string(), v.nonEmpty()),
  tableId: v.pipe(v.string(), v.nonEmpty()),
  display: v.string(),
})

export type BaseColumn = v.InferOutput<typeof baseColumnSchema>

/**
 * Relations
 */

export const columnRelationsSchema = v.object({
  // Table: v.lazy(() => baseTableSchema),
})

export type ColumnRelations = v.InferOutput<typeof columnRelationsSchema>

/**
 * Column
 */

export const columnSchema = v.intersect([baseColumnSchema, columnRelationsSchema])

export type Column = v.InferOutput<typeof columnSchema>

/**
 * CreateColumn
 */

export const createColumnSchema = baseColumnSchema

export type CreateColumn = v.InferOutput<typeof createColumnSchema>

/**
 * UpdateColumn
 */

export const updateColumnSchema = baseColumnSchema

export type UpdateColumn = v.InferOutput<typeof updateColumnSchema>
