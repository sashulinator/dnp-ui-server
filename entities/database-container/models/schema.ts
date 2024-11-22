import * as v from 'valibot'

/**
 * BaseSchema
 */

export const baseSchemaSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(v.string(), v.nonEmpty()),
  display: v.string(),
  databaseId: v.pipe(v.string(), v.nonEmpty()),
})

export type BaseSchema = v.InferOutput<typeof baseSchemaSchema>

/**
 * Relations
 */

export const schemaRelationsSchema = v.object({
  // Schema: v.lazy(() => baseSchemaSchema),
})

export type SchemaRelations = v.InferOutput<typeof schemaRelationsSchema>

/**
 * Schema
 */

export const schemaSchema = v.intersect([baseSchemaSchema, schemaRelationsSchema])

export type Schema = v.InferOutput<typeof schemaSchema>

/**
 * CreateSchema
 */

export const createSchemaSchema = baseSchemaSchema

export type CreateSchema = v.InferOutput<typeof createSchemaSchema>

/**
 * UpdateSchema
 */

export const updateSchemaSchema = baseSchemaSchema

export type UpdateSchema = v.InferOutput<typeof updateSchemaSchema>
