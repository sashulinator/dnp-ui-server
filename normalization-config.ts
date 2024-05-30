import * as v from 'valibot'

export const executable = v.object({
  'computable-config': v.object({
    'computable-name': v.pipe(v.string(), v.nonEmpty()),
    version: v.pipe(v.string(), v.nonEmpty()),
  }),
  'sdk-config': v.object({
    'sdk-name': v.pipe(v.string(), v.nonEmpty()),
    version: v.pipe(v.string(), v.nonEmpty()),
  }),
})

export type Executable = v.InferOutput<typeof executable>

export const normalizationConfigSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(v.string(), v.nonEmpty()),
  createdBy: v.pipe(v.string(), v.nonEmpty()),
  updatedBy: v.pipe(v.string(), v.nonEmpty()),
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  updatedAt: v.pipe(v.string(), v.nonEmpty()),
  data: v.object({
    executables: v.array(executable),
  }),
})

export type NormalizationConfig = v.InferOutput<typeof normalizationConfigSchema>
