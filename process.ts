import * as v from 'valibot'

/**
 * Process
 */

export const processSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  createdBy: v.pipe(v.string(), v.nonEmpty()),
  createdAt: v.pipe(v.string(), v.nonEmpty()),
  normalizationConfigId: v.pipe(v.string(), v.nonEmpty()),
})

export type Process = v.InferOutput<typeof processSchema>

/**
 * CreateProcess
 */
export const createProcessSchema = v.omit(processSchema, ['id', 'createdAt', 'createdBy'])

export type CreateProcess = v.InferOutput<typeof createProcessSchema>

/**
 * UpdateProcess
 */

export const updateProcessSchema = v.omit(processSchema, ['createdAt', 'createdBy'])

export type UpdateProcess = v.InferOutput<typeof updateProcessSchema>
