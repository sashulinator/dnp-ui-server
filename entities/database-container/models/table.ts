import * as v from 'valibot'

/**
 * BaseTable
 */

export const baseTableSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(v.string(), v.nonEmpty()),
  display: v.string(),
  schemaId: v.pipe(v.string(), v.nonEmpty()),
})

export type BaseTable = v.InferOutput<typeof baseTableSchema>

/**
 * Relations
 */

export const tableRelationsSchema = v.object({
  // Table: v.lazy(() => baseTableSchema),
})

export type TableRelations = v.InferOutput<typeof tableRelationsSchema>

/**
 * Table
 */

export const tableSchema = v.intersect([baseTableSchema, tableRelationsSchema])

export type Table = v.InferOutput<typeof tableSchema>

/**
 * CreateTable
 */

export const createTableSchema = baseTableSchema

export type CreateTable = v.InferOutput<typeof createTableSchema>

/**
 * UpdateTable
 */

export const updateTableSchema = baseTableSchema

export type UpdateTable = v.InferOutput<typeof updateTableSchema>
