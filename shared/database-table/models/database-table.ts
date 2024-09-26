import * as v from 'valibot'

/**
 * Column
 */

export const columnTypeModel = v.variant('type', [
  v.object({
    type: v.literal('string'),
    maxLength: v.number(),
  }),
  v.object({
    type: v.literal('integer'),
    isNegativeAllowed: v.boolean(),
    maxLength: v.number(),
  }),
  v.object({
    type: v.literal('number'),
    decimalPlaces: v.number(),
    isNegativeAllowed: v.boolean(),
    maxLength: v.number(),
  }),
  v.object({
    type: v.literal('float'),
    decimalPlaces: v.number(),
    isNegativeAllowed: v.boolean(),
    maxLength: v.number(),
  }),
  v.object({
    type: v.literal('byte'),
    isNegativeAllowed: v.boolean(),
    maxLength: v.number(),
  }),
  v.object({
    type: v.literal('short'),
    isNegativeAllowed: v.boolean(),
    maxLength: v.number(),
  }),
  v.object({
    type: v.literal('long'),
    isNegativeAllowed: v.boolean(),
    maxLength: v.number(),
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

export const columnModel = v.intersect([
  columnTypeModel,
  v.object({
    id: v.string(),
    name: v.string(),
    columnName: v.string(),
    defaultTo: v.optional(v.string()),
    index: v.optional(v.boolean()),
    nullable: v.optional(v.boolean()),
    relation: v.optional(v.lazy(() => relationModel)),
  }),
])

export type Column = v.InferOutput<typeof columnModel>

/**
 * Relation
 */

export const relationModel = v.object({
  columnName: v.string(),
  kn: v.string(),
})

export type Relation = v.InferOutput<typeof columnModel>
