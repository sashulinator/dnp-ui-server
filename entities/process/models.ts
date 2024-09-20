import * as v from 'valibot'

import { getObjectKeys } from '~/common/lib/get-object-keys'
import { creatableSchema } from '~/common/models/crudable'

import {
  driverUniversalServicesSchema,
  executableSchema,
  normalizationConfigSchema,
  preloadJarsSchema,
  sdkSchema,
  sparkSchema,
} from '../normalization-config'
import { userSchema } from '../user'

/**
 * BaseProcess
 */

export const baseProcessSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  normalizationConfigId: v.pipe(v.string(), v.nonEmpty()),
  type: v.pipe(v.string(), v.nonEmpty()),
  data: v.object({
    executables: v.array(executableSchema),
    sdk: sdkSchema,
    spark: sparkSchema,
    'preload-jars': preloadJarsSchema,
    'driver-universal-services': driverUniversalServicesSchema,
  }),
  ...creatableSchema.entries,
})

export type BaseProcess = v.InferOutput<typeof baseProcessSchema>

/**
 * Relations
 */

export const processRelationsSchema = v.object({
  normalizationConfig: v.lazy(() => normalizationConfigSchema),
  createdBy: v.lazy(() => userSchema),
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

export const createProcessSchema = v.omit(baseProcessSchema, ['id', ...getObjectKeys(creatableSchema.entries)])

export type CreateProcess = v.InferOutput<typeof createProcessSchema>

/**
 * UpdateProcess
 */

export const updateProcessSchema = v.omit(baseProcessSchema, ['id', ...getObjectKeys(creatableSchema.entries)])

export type UpdateProcess = v.InferOutput<typeof updateProcessSchema>
