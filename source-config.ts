import * as v from 'valibot'

/**
 * SourceConfig
 */

export const SourceConfigSchema = v.object({
  keyName: v.pipe(v.string(), v.nonEmpty()),
  createdBy: v.pipe(v.string(), v.nonEmpty()),
  updatedBy: v.pipe(v.string(), v.nonEmpty()),
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  updatedAt: v.pipe(v.string(), v.nonEmpty()),
  data: v.looseObject({}),
})

export type SourceConfig = v.InferOutput<typeof SourceConfigSchema>

/**
 * CreateSourceConfig
 */
export const createSourceConfigSchema = v.omit(SourceConfigSchema, ['createdAt', 'createdBy'])

export type CreateSourceConfig = v.InferOutput<typeof createSourceConfigSchema>

/**
 * UpdateSourceConfig
 */

export const updateSourceConfigSchema = v.omit(SourceConfigSchema, ['createdAt', 'createdBy'])

export type UpdateSourceConfig = v.InferOutput<typeof updateSourceConfigSchema>
