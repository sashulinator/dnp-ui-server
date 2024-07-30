import * as v from 'valibot'
import { getObjectKeys } from '~/common/lib/get-object-keys'
import { crudableSchema } from '~/common/models/crudable'

/**
 * BaseEntity
 */

export const baseEntitySchema = v.object({
  kn: v.string(),
  name: v.string(),
  tableKn: v.string(),
  nav: v.boolean(),
  data: v.object({}),
  ...crudableSchema.entries,
})

export type BaseEntity = v.InferOutput<typeof baseEntitySchema>

/**
 * Relations
 */

export const entityRelationsSchema = v.object({})

export type EntityRelations = v.InferOutput<typeof entityRelationsSchema>

/**
 * Entity
 */

export const entitySchema = v.intersect([baseEntitySchema, entityRelationsSchema])

export type Entity = v.InferOutput<typeof entitySchema>

/**
 * CreateEntity
 */

export const createEntitySchema = v.omit(baseEntitySchema, getObjectKeys(crudableSchema.entries))

export type CreateEntity = v.InferOutput<typeof createEntitySchema>

/**
 * UpdateEntity
 */

export const updateEntitySchema = v.omit(baseEntitySchema, getObjectKeys(crudableSchema.entries))

export type UpdateEntity = v.InferOutput<typeof updateEntitySchema>
