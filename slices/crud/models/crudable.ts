import * as v from 'valibot'

export const creatableModel = v.object({
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  createdById: v.pipe(v.string(), v.nonEmpty()),
})

export type Creatable = v.InferOutput<typeof creatableModel>

export const updatableModel = v.object({
  updatedAt: v.pipe(v.string(), v.nonEmpty()),
  updatedById: v.pipe(v.string(), v.nonEmpty()),
})

export type Updatable = v.InferOutput<typeof updatableModel>

export const crudableModel = v.object({
  ...creatableModel.entries,
  ...updatableModel.entries,
})

export type Crudable = v.InferOutput<typeof updatableModel>
