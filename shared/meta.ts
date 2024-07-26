import * as v from 'valibot'

export const creatableSchema = v.object({
  createdBy: v.pipe(v.string(), v.nonEmpty()),
  createdAt: v.pipe(v.string(), v.nonEmpty()),
})

export type Creatable = v.InferOutput<typeof creatableSchema>

export const updatableSchema = v.object({
  updatedBy: v.pipe(v.string(), v.nonEmpty()),
  updatedAt: v.pipe(v.string(), v.nonEmpty()),
})

export type Updatable = v.InferOutput<typeof updatableSchema>
