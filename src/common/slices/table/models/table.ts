import * as v from 'valibot'

import { columnSchema as databaseColumnSchema, relationSchema as databaseRelationSchema } from '../../database'

/**
 * Table
 */

export const tableSchema = v.object({
  kn: v.string(),
  display: v.string(),
  nav: v.boolean(),
  description: v.string(),
  defaultView: v.union([v.literal('tree'), v.literal('table')]),
  name: v.string(),
  columns: v.array(v.lazy(() => columnSchema)),
})

export type Table = v.InferOutput<typeof tableSchema>

/**
 * Column
 */

export const columnSchema = v.intersect([
  databaseColumnSchema,
  v.object({
    id: v.string(),
    display: v.string(),
    relation: v.optional(v.lazy(() => relationSchema)),
  }),
])

export type Column = v.InferOutput<typeof columnSchema>

/**
 * Relation
 */

export const relationSchema = databaseRelationSchema

export type Relation = v.InferOutput<typeof relationSchema>

/**
 * Row
 */

export type Row = Record<string | number, unknown>
