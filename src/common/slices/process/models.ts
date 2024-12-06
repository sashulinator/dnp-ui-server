import * as v from 'valibot'

import { creatableModel } from '~/common/slices/crud/models/crudable'

import { userSchema } from '../../entities/user'
import { getKeys } from '../dictionary'

/**
 * Base
 */

export const baseProcessSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  // можно положить id сущности которая вызвала процесс
  track: v.pipe(v.string(), v.nonEmpty()),
  type: v.pipe(v.string(), v.nonEmpty()),
  data: v.object({}),
  ...creatableModel.entries,
})

export type BaseProcess = v.InferOutput<typeof baseProcessSchema>

/**
 * Relations
 */

export const processEventSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  event: v.pipe(v.string(), v.nonEmpty()),
  calculation_id: v.number(),
  procedure_id: v.pipe(v.string(), v.nonEmpty()),
  step: v.number(),
  timestamp: v.pipe(v.string(), v.nonEmpty()),
})

export const processRelationsSchema = v.object({
  // normalizationConfig: v.lazy(() => normalizationConfigSchema),
  createdBy: v.lazy(() => userSchema),
  events: v.lazy(() => v.array(processEventSchema)),
})

export type ProcessRelations = v.InferOutput<typeof processRelationsSchema>

/**
 * Process
 */

export const processSchema = v.intersect([baseProcessSchema, processRelationsSchema])

export type Process = v.InferOutput<typeof processSchema>

/**
 * CreateInput
 */

export const processCreateInputSchema = v.omit(baseProcessSchema, ['id', ...getKeys(creatableModel.entries)])

export type ProcessCreateInput = v.InferOutput<typeof processCreateInputSchema>

/**
 * UpdateInput
 */

export const processUpdateInputSchema = v.omit(baseProcessSchema, ['id', ...getKeys(creatableModel.entries)])

export type ProcessUpdateInput = v.InferOutput<typeof processUpdateInputSchema>
