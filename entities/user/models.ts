import * as v from 'valibot'

/**
 * BaseUser
 */

export const baseUserSchema = v.object({
  id: v.string(),
  name: v.string(),
  password: v.string(),
})

export type BaseUser = v.InferOutput<typeof baseUserSchema>

/**
 * Relations
 */

export const userRelationsSchema = v.object({})

export type UserRelations = v.InferOutput<typeof userRelationsSchema>

/**
 * User
 */

export const userSchema = v.intersect([baseUserSchema, userRelationsSchema])

export type User = v.InferOutput<typeof userSchema>

/**
 * CreateUser
 */

export const createUserSchema = baseUserSchema

export type CreateUser = v.InferOutput<typeof createUserSchema>

/**
 * UpdateUser
 */

export const updateUserSchema = baseUserSchema

export type UpdateUser = v.InferOutput<typeof updateUserSchema>
