import * as v from 'valibot'

export const schemaModel = v.object({
  // defaultView: v.union([v.literal('tree'), v.literal('table')]),
  items: v.array(v.lazy(() => schemaItemModel)),
})

export type Schema = v.InferOutput<typeof schemaModel>

/**
 * TableModelItem
 */

export const schemaItemModel = v.object({
  id: v.string(),
  name: v.string(),
  columnName: v.string(),
  defaultTo: v.optional(v.string()),
  index: v.optional(v.boolean()),
  nullable: v.optional(v.boolean()),
  type: v.string(),
  relation: v.optional(
    v.object({
      type: v.string(),
      columnName: v.string(),
      kn: v.string(),
    }),
  ),
})

export type SchemaItem = v.InferOutput<typeof schemaItemModel>
