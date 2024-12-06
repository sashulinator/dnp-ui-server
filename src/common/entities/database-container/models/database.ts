import * as v from 'valibot'

/**
 * Base
 */

export const baseDatabaseSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(v.string(), v.nonEmpty()),
  display: v.string(),
  serviceId: v.pipe(v.string(), v.nonEmpty()),
})

export type BaseDatabase = v.InferOutput<typeof baseDatabaseSchema>

/**
 * Relations
 */

export const databaseRelationsSchema = v.object({
  // Table: v.lazy(() => baseTableSchema),
})

export type DatabaseRelations = v.InferOutput<typeof databaseRelationsSchema>

/**
 * Database
 */

export const databaseSchema = v.intersect([baseDatabaseSchema, databaseRelationsSchema])

export type Database = v.InferOutput<typeof databaseSchema>

/**
 * CreateInput
 */

export const databaseCreateInputSchema = baseDatabaseSchema

export type DatabaseCreateInput = v.InferOutput<typeof databaseCreateInputSchema>

/**
 * UpdateInput
 */

export const databaseUpdateInputSchema = baseDatabaseSchema

export type DatabaseUpdateInput = v.InferOutput<typeof databaseUpdateInputSchema>
