import * as v from 'valibot'
import { getObjectKeys } from '~/common/lib/get-object-keys'
import { crudableSchema } from '~/common/models/crudable'

/**
 * BaseEntity
 */

export const baseEntityConfigSchema = v.object({
  kn: v.string(),
  name: v.string(),
  tableKn: v.string(),
  nav: v.boolean(),
  data: v.object({}),
  ...crudableSchema.entries,
})

export type BaseEntityConfig = v.InferOutput<typeof baseEntityConfigSchema>

/**
 * Relations
 */

export const entityRelationsSchema = v.object({})

export type EntityConfigRelations = v.InferOutput<typeof entityRelationsSchema>

/**
 * Entity
 */

export const entityConfigSchema = v.intersect([baseEntityConfigSchema, entityRelationsSchema])

export type EntityConfig = v.InferOutput<typeof entityConfigSchema>

/**
 * CreateEntity
 */

export const createEntityConfigSchema = v.omit(baseEntityConfigSchema, getObjectKeys(crudableSchema.entries))

export type CreateEntityConfig = v.InferOutput<typeof createEntityConfigSchema>

/**
 * UpdateEntity
 */

export const updateEntityConfigSchema = v.omit(baseEntityConfigSchema, getObjectKeys(crudableSchema.entries))

export type UpdateEntityConfig = v.InferOutput<typeof updateEntityConfigSchema>
