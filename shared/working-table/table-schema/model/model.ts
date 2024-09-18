import * as v from 'valibot'

/**
 * Schema
 */

export const schemaModel = v.object({
  items: v.array(v.lazy(() => schemaItemModel)),
})

export type Schema = v.InferOutput<typeof schemaModel>

/**
 * SchemaItem
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
      columnName: v.string(),
      kn: v.string(),
    }),
  ),
})

export type SchemaItem = v.InferOutput<typeof schemaItemModel>
