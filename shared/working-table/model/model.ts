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

export const schemaItemModelBase = v.object({
  id: v.string(),
  name: v.string(),
  columnName: v.string(),
  defaultTo: v.optional(v.string()),
  index: v.optional(v.boolean()),
  nullable: v.optional(v.boolean()),
  relation: v.optional(
    v.object({
      columnName: v.string(),
      kn: v.string(),
    }),
  ),
})

// Добавляем варианты для type и связанных полей
export const schemaItemModelVariants = v.variant('type', [
  v.object({
    type: v.literal('string'),
    maxLength: v.number(),
    decimalPlaces: v.optional(v.number()),
    isNegativeAllowed: v.optional(v.boolean()),
  }),
  v.object({
    type: v.literal('integer'),
    decimalPlaces: v.optional(v.number()),
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
    decimalPlaces: v.optional(v.number()),
    isNegativeAllowed: v.boolean(),
    maxLength: v.number(),
  }),
  v.object({
    type: v.literal('short'),
    decimalPlaces: v.optional(v.number()),
    isNegativeAllowed: v.boolean(),
    maxLength: v.number(),
  }),
  v.object({
    type: v.literal('long'),
    decimalPlaces: v.optional(v.number()),
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
    decimalPlaces: v.optional(v.number()),
    maxLength: v.optional(v.number()),
    isNegativeAllowed: v.optional(v.boolean()),
  }),
  v.object({
    type: v.literal('date'),
    decimalPlaces: v.optional(v.number()),
    maxLength: v.optional(v.number()),
    isNegativeAllowed: v.optional(v.boolean()),
  }),
])

type SchemaItemBase = v.InferOutput<typeof schemaItemModelBase>
type SchemaItemVariants = v.InferOutput<typeof schemaItemModelVariants>

export const schemaItemModel = v.intersect([schemaItemModelBase, schemaItemModelVariants])

export type SchemaItem = SchemaItemBase & SchemaItemVariants
