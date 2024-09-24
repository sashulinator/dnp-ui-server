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

type SchemaItemBase = v.InferOutput<typeof schemaItemModelBase>
type SchemaItemVariants = v.InferOutput<typeof schemaItemModelVariants>

export const schemaItemModel = v.intersect([schemaItemModelBase, schemaItemModelVariants])

export type SchemaItem = SchemaItemBase & SchemaItemVariants
