import * as v from 'valibot'

/**
 * QueryFilter
 */

export const queryFilterSchema = v.object({
  id: v.string(),
  name: v.string(),
  track: v.string(),
  data: v.any(),
})

export type QueryFilter = v.InferOutput<typeof queryFilterSchema>

/**
 * CreateInput
 */

export const QueryFilterCreateInputSchema = v.omit(queryFilterSchema, ['id'])

export type QueryFilterCreateInput = v.InferOutput<typeof QueryFilterCreateInputSchema>

/**
 * UpdateInput
 */

export const QueryFilterUpdateInputSchema = queryFilterSchema

export type QueryFilterUpdateInput = v.InferOutput<typeof QueryFilterUpdateInputSchema>
