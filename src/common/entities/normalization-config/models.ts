import * as v from 'valibot'
import { baseProcessSchema } from '../process'

/**
 * Executable
 */

export const executableSchema = v.object({
  'computable-config': v.object({
    'computable-name': v.pipe(v.string(), v.nonEmpty()),
    version: v.pipe(v.string(), v.nonEmpty()),
  }),
  'sdk-config': v.object({
    'sdk-name': v.pipe(v.string(), v.nonEmpty()),
    version: v.pipe(v.string(), v.nonEmpty()),
  }),
})

export type Executable = v.InferOutput<typeof executableSchema>

/**
 * Sdk
 */

export const sdkSchema = v.looseObject({})

export type Sdk = v.InferOutput<typeof sdkSchema>

/**
 * Spark
 */

export const sparkSchema = v.looseObject({})

export type Spark = v.InferOutput<typeof sparkSchema>

/**
 * PreloadJars
 */

export const preloadJarsSchema = v.array(v.looseObject({}))

export type PreloadJars = v.InferOutput<typeof preloadJarsSchema>

/**
 * DriverUniversalServices
 */

export const driverUniversalServicesSchema = v.array(v.string())

export type DriverUniversalServices = v.InferOutput<typeof driverUniversalServicesSchema>

/**
 * BaseNormalizationConfig
 */

export const baseNormalizationConfigSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  v: v.pipe(v.number(), v.notValue(0)),
  name: v.pipe(v.string(), v.nonEmpty()),
  last: v.boolean(),
  createdBy: v.pipe(v.string(), v.nonEmpty()),
  updatedBy: v.pipe(v.string(), v.nonEmpty()),
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  updatedAt: v.pipe(v.string(), v.nonEmpty()),
  data: v.object({
    executables: v.array(executableSchema),
    sdk: sdkSchema,
    spark: sparkSchema,
    'preload-jars': preloadJarsSchema,
    'driver-universal-services': driverUniversalServicesSchema,
  }),
})

export type BaseNormalizationConfig = v.InferOutput<typeof baseNormalizationConfigSchema>

/**
 * Relations
 */

export const normalizationConfigRelationsSchema = v.object({
  processes: v.array(baseProcessSchema),
})

export type NormalizationConfigRelations = v.InferOutput<typeof normalizationConfigRelationsSchema>

/**
 * NormalizationConfig
 */

export const normalizationConfigSchema = v.intersect([
  baseNormalizationConfigSchema,
  normalizationConfigRelationsSchema,
])

export type NormalizationConfig = v.InferOutput<typeof normalizationConfigSchema>

/**
 * CreateNormalizationConfig
 */

export const createNormalizationConfigSchema = v.omit(baseNormalizationConfigSchema, [
  'id',
  'v',
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
])

export type CreateNormalizationConfig = v.InferOutput<typeof createNormalizationConfigSchema>

/**
 * UpdateNormalizationConfig
 */

export const updateNormalizationConfigSchema = v.omit(baseNormalizationConfigSchema, [
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
  'v',
])

export type UpdateNormalizationConfig = v.InferOutput<typeof updateNormalizationConfigSchema>
