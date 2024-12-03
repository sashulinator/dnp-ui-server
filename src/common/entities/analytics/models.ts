import * as v from 'valibot'

/**
 * Actions
 */

export const action = v.object({
  id: v.number(),
  description: v.string(),
  name: v.string(),
  display: v.string(),
  group: v.string(),
  isText: v.boolean(),
  isInt: v.boolean(),
  isDate: v.boolean(),
})

export type Action = v.InferOutput<typeof action>
