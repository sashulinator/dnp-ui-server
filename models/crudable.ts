import * as v from 'valibot'

export const creatableSchema = v.object({
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  createdById: v.pipe(v.string(), v.nonEmpty()),
})

export type Creatable = v.InferOutput<typeof creatableSchema>

export const updatableSchema = v.object({
  updatedAt: v.pipe(v.string(), v.nonEmpty()),
  updatedById: v.pipe(v.string(), v.nonEmpty()),
})

export type Updatable = v.InferOutput<typeof updatableSchema>

export const crudableSchema = v.object({
  ...creatableSchema.entries,
  ...updatableSchema.entries,
})

export type crudableSchema = v.InferOutput<typeof updatableSchema>
