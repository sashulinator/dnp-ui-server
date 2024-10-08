import * as v from 'valibot'

import { creatableModel } from '~/common/shared/crud/models/crudable'

import { getKeys } from '../../shared/dictionary'
import { userSchema } from '../user'

export const processType = {
  IMPORT: 'IMPORT',
  EXPORT: 'EXPORT',
  REPORT: 'REPORT',
  NORMALIZATION: 'NORMALIZATION',
} as const

type ProcessTypeKey = keyof typeof processType

export type ProcessType = (typeof processType)[ProcessTypeKey]

/**
 * BaseProcess
 */

export const baseProcessSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  type: v.enum_(processType),
  normalizationConfigId: v.pipe(v.string(), v.nonEmpty()),
  normalizationConfigVersion: v.number(),
  eventTrackingId: v.number(),
  tableId: v.pipe(v.string(), v.nonEmpty()),
  runtimeConfigData: v.object({}),
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
 * CreateProcess
 */

export const createProcessSchema = v.omit(baseProcessSchema, ['id', ...getKeys(creatableModel.entries)])

export type CreateProcess = v.InferOutput<typeof createProcessSchema>

/**
 * UpdateProcess
 */

export const updateProcessSchema = v.omit(baseProcessSchema, ['id', ...getKeys(creatableModel.entries)])

export type UpdateProcess = v.InferOutput<typeof updateProcessSchema>
