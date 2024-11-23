import * as v from 'valibot'

/**
 * BaseService
 */

export const baseServiceSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  display: v.string(),
  host: v.pipe(v.string(), v.nonEmpty()),
  port: v.number(),
  username: v.pipe(v.string(), v.nonEmpty()),
  password: v.pipe(v.string(), v.nonEmpty()),
})

export type BaseService = v.InferOutput<typeof baseServiceSchema>

/**
 * Relations
 */

export const serviceRelationsSchema = v.object({
  // Table: v.lazy(() => baseTableSchema),
})

export type ServiceRelations = v.InferOutput<typeof serviceRelationsSchema>

/**
 * Service
 */

export const serviceSchema = v.intersect([baseServiceSchema, serviceRelationsSchema])

export type Service = v.InferOutput<typeof serviceSchema>

/**
 * CreateService
 */

export const createServiceSchema = baseServiceSchema

export type CreateService = v.InferOutput<typeof createServiceSchema>

/**
 * UpdateService
 */

export const updateServiceSchema = baseServiceSchema

export type UpdateService = v.InferOutput<typeof updateServiceSchema>
