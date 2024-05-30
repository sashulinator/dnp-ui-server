import * as v from 'valibot'

export const executableSchema = v.object({
  'computable-config': v.object({
    'computable-name': v.pipe(v.string(), v.nonEmpty()),
    version: v.pipe(v.string(), v.nonEmpty()),
  }),
  'sdk-config': v.object({
    'sdk-name': v.pipe(v.string(), v.nonEmpty()),
    version: v.pipe(v.string(), v.nonEmpty()),
  }),
})

export type Executable = v.InferOutput<typeof executableSchema>

export const normalizationConfigSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(v.string(), v.nonEmpty()),
  createdBy: v.pipe(v.string(), v.nonEmpty()),
  updatedBy: v.pipe(v.string(), v.nonEmpty()),
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  updatedAt: v.pipe(v.string(), v.nonEmpty()),
  data: v.object({
    executables: v.array(executableSchema),
  }),
})

export type NormalizationConfig = v.InferOutput<typeof normalizationConfigSchema>

export const createNormalizationConfigSchema = v.omit(normalizationConfigSchema, [
  'id',
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
])

export type CreateNormalizationConfig = v.InferOutput<typeof createNormalizationConfigSchema>

export const updateNormalizationConfigSchema = v.omit(normalizationConfigSchema, [
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
])

export type UpdateNormalizationConfig = v.InferOutput<typeof updateNormalizationConfigSchema>
