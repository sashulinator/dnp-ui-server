import * as v from 'valibot'
import { userSchema } from '../user'
import { getObjectKeys } from '~/common/lib/get-object-keys'
import { crudableSchema } from '~/common/models/crudable'

/**
 * BaseOperationalTable
 */

export const baseOperationalTableSchema = v.object({
  kn: v.string(),
  name: v.string(),
  nav: v.boolean(),
  tableName: v.string(),
  tableSchema: v.array(v.looseObject({})),
  // meta
  ...crudableSchema.entries,
})

export type BaseOperationalTable = v.InferOutput<typeof baseOperationalTableSchema>

/**
 * Relations
 */

export const operationalTableRelationsSchema = v.object({
  createdBy: userSchema,
  updatedBy: userSchema,
})

export type OperationalTableRelations = v.InferOutput<typeof operationalTableRelationsSchema>

/**
 * OperationalTable
 */

export const operationalTableSchema = v.intersect([baseOperationalTableSchema, operationalTableRelationsSchema])

export type OperationalTable = v.InferOutput<typeof operationalTableSchema>

/**
 * CreateOperationalTable
 */

export const createOperationalTableSchema = v.omit(baseOperationalTableSchema, getObjectKeys(crudableSchema.entries))

export type CreateOperationalTable = v.InferOutput<typeof createOperationalTableSchema>

/**
 * UpdateOperationalTable
 */

export const updateOperationalTableSchema = v.omit(baseOperationalTableSchema, getObjectKeys(crudableSchema.entries))

export type UpdateOperationalTable = v.InferOutput<typeof updateOperationalTableSchema>
