import * as v from 'valibot'

/**
 * BaseHeap
 */

export const baseHeapSchema = v.object({
  name: v.string(),
  description: v.string(),
  data: v.looseObject({}),
})

/**
 * CreateHeapSchema
 */

export const createHeapSchema = baseHeapSchema

export type CreateHeapSchema = v.InferOutput<typeof createHeapSchema>

/**
 * UpdateHeapSchema
 */

export const updateHeapSchema = baseHeapSchema

export type UpdateHeapSchema = v.InferOutput<typeof updateHeapSchema>
