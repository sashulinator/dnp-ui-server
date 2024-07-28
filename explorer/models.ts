import * as v from 'valibot'

/**
 * Explorer
 */

export const explorerSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  type: v.union([v.literal('jdbc'), v.literal('s3'), v.literal('table')]),
  items: v.union([v.array(v.lazy(() => jdbcItemSchema))]),
})

export type Explorer = v.InferOutput<typeof explorerSchema>

/**
 * JdbcItem
 */

export const jdbcItemSchema = v.object({
  type: v.union([v.literal('table'), v.literal('record')]),
  name: v.pipe(v.string(), v.nonEmpty()),
  data: v.union([v.object({}), v.never()]),
})

export type JdbcItem = v.InferOutput<typeof jdbcItemSchema>
