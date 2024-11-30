import * as v from 'valibot'

/**
 * BaseService
 */

export const dcserviceBaseSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  display: v.string(),
  host: v.pipe(v.string(), v.nonEmpty()),
  port: v.number(),
  username: v.pipe(v.string(), v.nonEmpty()),
  password: v.pipe(v.string(), v.nonEmpty()),
})

export type DcserviceBase = v.InferOutput<typeof dcserviceBaseSchema>

/**
 * Relations
 */

export const dcserviceRelationsSchema = v.object({
  // Table: v.lazy(() => baseTableSchema),
})

export type DcserviceRelations = v.InferOutput<typeof dcserviceRelationsSchema>

/**
 * Service
 */

export const dcserviceSchema = v.intersect([dcserviceBaseSchema, dcserviceRelationsSchema])

export type Dcservice = v.InferOutput<typeof dcserviceSchema>

/**
 * CreateService
 */

export const dcserviceCreateInputSchema = v.omit(dcserviceBaseSchema, ['id'])

export type DcserviceCreateInput = v.InferOutput<typeof dcserviceCreateInputSchema>

/**
 * UpdateService
 */

export const dcserviceUpdateInputSchema = dcserviceBaseSchema

export type DcserviceUpdateInput = v.InferOutput<typeof dcserviceUpdateInputSchema>
