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
 * UpdateStoreConfig
 */

export const updateBaseHeapSchema = baseHeapSchema

export type UpdateBaseHeapSchema = v.InferOutput<typeof updateBaseHeapSchema>
