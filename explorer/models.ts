import * as v from 'valibot'

/**
 * Explorer
 */

export const explorerSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  type: v.lazy(() => typeSchema),
  items: v.array(v.lazy(() => itemSchema)),
})

export type Explorer = v.InferOutput<typeof explorerSchema>

/**
 * Path
 */

export const pathSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  type: v.lazy(() => typeSchema),
})

export type Path = v.InferOutput<typeof pathSchema>

/**
 * Item
 */

export const itemSchema = v.union([v.lazy(() => jdbcItemSchema)])

export type Item = v.InferOutput<typeof itemSchema>

/**
 * type
 */

export const typeSchema = v.union([v.literal('jdbc'), v.literal('s3'), v.literal('table'), v.literal('record')])

export type Type = v.InferOutput<typeof typeSchema>

/**
 * JdbcItem
 */

export const jdbcItemSchema = v.object({
  type: typeSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  data: v.union([v.object({}), v.never()]),
})

export type JdbcItem = v.InferOutput<typeof jdbcItemSchema>
