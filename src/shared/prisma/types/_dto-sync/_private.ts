import { type JsonValue } from '@prisma/client/runtime/library'

export function check<Type extends Record<string, unknown>, PrismaType extends Record<string, unknown>>(
  prismatype: DateToString<PrismaType>,
  type: ObjectToJsonValue<Type>,
) {
  return { type, ptype: prismatype }
}

export type DateToString<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K]
}

export type ObjectToJsonValue<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown> | unknown[] ? JsonValue : T[K]
}
