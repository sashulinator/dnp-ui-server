import * as v from 'valibot'

/**
 * Explorer
 */

export const explorerSchema = v.object({
  paths: v.array(v.lazy(() => pathSchema)),
  name: v.pipe(v.string(), v.nonEmpty()),
  type: v.lazy(() => typeSchema),
  items: v.array(v.lazy(() => itemSchema)),
  total: v.number(),
})

export type Explorer = v.InferOutput<typeof explorerSchema>

/**
 * Item
 */

export const itemSchema = v.object({
  type: v.lazy(() => typeSchema),
  name: v.pipe(v.string(), v.nonEmpty()),
  data: v.union([v.object({}), v.never()]),
})

export type Item = v.InferOutput<typeof itemSchema>

/**
 * type
 */

export const typeSchema = v.union([v.literal('jdbc'), v.literal('s3'), v.literal('table'), v.literal('record')])

export type Type = v.InferOutput<typeof typeSchema>

/**
 * Path
 */

export const pathSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  type: v.lazy(() => typeSchema),
})

export type Path = v.InferOutput<typeof pathSchema>

/**
 * StoreConfig
 */

export const storeConfigSchema = v.object({
  host: v.pipe(v.string(), v.nonEmpty()),
  port: v.pipe(v.string(), v.nonEmpty()),
  username: v.pipe(v.string(), v.nonEmpty()),
  password: v.pipe(v.string(), v.nonEmpty()),
})

export type StoreConfig = v.InferOutput<typeof storeConfigSchema>
