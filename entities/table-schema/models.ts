import * as v from 'valibot'
import { userSchema } from '../user'

/**
 * BaseTargetTable
 */

export const baseTargetTableSchema = v.object({
  kn: v.string(),
  data: v.object({}),
  // meta
  createdById: v.pipe(v.string(), v.nonEmpty()),
  updatedById: v.pipe(v.string(), v.nonEmpty()),
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  updatedAt: v.pipe(v.string(), v.nonEmpty()),
})

export type BaseTargetTable = v.InferOutput<typeof baseTargetTableSchema>

/**
 * Relations
 */

export const targetTableRelationsSchema = v.object({
  createdBy: userSchema,
  updatedBy: userSchema,
})

export type TargetTableRelations = v.InferOutput<typeof targetTableRelationsSchema>

/**
 * TargetTable
 */

export const targetTableSchema = v.intersect([baseTargetTableSchema, targetTableRelationsSchema])

export type TargetTable = v.InferOutput<typeof targetTableSchema>

/**
 * CreateTargetTable
 */

export const createTargetTableSchema = v.omit(baseTargetTableSchema, [
  'updatedById',
  'createdById',
  'createdAt',
  'updatedAt',
])

export type CreateTargetTable = v.InferOutput<typeof createTargetTableSchema>

/**
 * UpdateTargetTable
 */

export const updateTargetTableSchema = v.omit(baseTargetTableSchema, [
  'updatedById',
  'createdById',
  'createdAt',
  'updatedAt',
])

export type UpdateTargetTable = v.InferOutput<typeof updateTargetTableSchema>
