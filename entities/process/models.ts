import * as v from 'valibot'
import { normalizationConfigSchema } from '../normalization-config'

/**
 * BaseProcess
 */

export const baseProcessSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  createdBy: v.pipe(v.string(), v.nonEmpty()),
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  normalizationConfigId: v.pipe(v.string(), v.nonEmpty()),
})

export type BaseProcess = v.InferOutput<typeof baseProcessSchema>

/**
 * Relations
 */

export const processRelationsSchema = v.object({
  normalizationConfig: normalizationConfigSchema,
})

export type ProcessRelations = v.InferOutput<typeof processRelationsSchema>

/**
 * Process
 */

export const processSchema = v.intersect([baseProcessSchema, processRelationsSchema])

export type Process = v.InferOutput<typeof processSchema>

/**
 * CreateProcess
 */

export const createProcessSchema = v.omit(baseProcessSchema, ['id', 'createdAt', 'createdBy'])

export type CreateProcess = v.InferOutput<typeof createProcessSchema>

/**
 * UpdateProcess
 */

export const updateProcessSchema = v.omit(baseProcessSchema, ['createdAt', 'createdBy'])

export type UpdateProcess = v.InferOutput<typeof updateProcessSchema>
