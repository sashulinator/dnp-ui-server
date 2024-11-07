import * as v from 'valibot'

/**
 * Table
 */

export const tableSchema = v.object({
  name: v.string(),
  columns: v.array(v.lazy(() => columnSchema)),
})

export type Table = v.InferOutput<typeof tableSchema>

/**
 * Column
 */

const _columnTypeSchema = v.variant('type', [
  v.object({
    type: v.literal('increments'),
  }),
  v.object({
    type: v.literal('string'),
    maxLength: v.optional(v.number()),
  }),
  v.object({
    type: v.literal('integer'),
    isNegativeAllowed: v.boolean(),
    maxLength: v.optional(v.number()),
  }),
  v.object({
    type: v.literal('number'),
    decimalPlaces: v.number(),
    isNegativeAllowed: v.boolean(),
    maxLength: v.optional(v.number()),
  }),
  v.object({
    type: v.literal('float'),
    decimalPlaces: v.number(),
    isNegativeAllowed: v.boolean(),
    maxLength: v.optional(v.number()),
  }),
  v.object({
    type: v.literal('byte'),
    isNegativeAllowed: v.boolean(),
    maxLength: v.optional(v.number()),
  }),
  v.object({
    type: v.literal('short'),
    isNegativeAllowed: v.boolean(),
    maxLength: v.optional(v.number()),
  }),
  v.object({
    type: v.literal('long'),
    isNegativeAllowed: v.boolean(),
    maxLength: v.optional(v.number()),
  }),
  v.object({
    type: v.literal('double'),
    decimalPlaces: v.number(),
    isNegativeAllowed: v.boolean(),
    maxLength: v.number(),
  }),
  v.object({
    type: v.literal('boolean'),
  }),
  v.object({
    type: v.literal('date'),
  }),
])

export const columnSchema = v.intersect([
  _columnTypeSchema,
  v.object({
    name: v.string(),
    defaultTo: v.optional(v.string()),
    index: v.optional(v.boolean()),
    primary: v.optional(v.boolean()),
    nullable: v.optional(v.boolean()),
    unique: v.optional(v.boolean()),
    relation: v.optional(v.lazy(() => relationSchema)),
  }),
])

export type Column = v.InferOutput<typeof columnSchema>

/**
 * Relation
 */

export const relationSchema = v.object({
  tableName: v.string(),
  columnName: v.string(),
})

export type Relation = v.InferOutput<typeof relationSchema>

/**
 * Row
 */

export type Row = Record<string | number, unknown>
