import * as v from 'valibot'

/**
 * DatabaseTable
 */

export const DatabaseTableModel = v.object({
  items: v.array(v.lazy(() => itemModel)),
})

export type DatabaseTable = v.InferOutput<typeof DatabaseTableModel>

/**
 * Item
 */

export const itemModel = v.object({
  id: v.string(),
  name: v.string(),
  columnName: v.string(),
  defaultTo: v.optional(v.string()),
  index: v.optional(v.boolean()),
  nullable: v.optional(v.boolean()),
  type: v.string(),
  relation: v.optional(v.lazy(() => relationModel)),
})

export type Item = v.InferOutput<typeof itemModel>

/**
 * Relation
 */

export const relationModel = v.object({
  columnName: v.string(),
  kn: v.string(),
})

export type Relation = v.InferOutput<typeof itemModel>
