import type { BooleanFilter } from './boolean-filter'
import type { IntFilter } from './int-filter'
import type { StringFilter } from './string-filter'

export type Where<T extends Record<string, unknown> = Record<string, unknown>> = {
  AND?: Where<T> | Where<T>[]
  OR?: Where<T>[]
  NOT?: Where<T> | Where<T>[]
} & ReplaceValueByFilter<T>

export type ReplaceValueByFilter<T> = {
  [K in keyof T]?: T[K] extends string
    ? StringFilter
    : T[K] extends number
      ? IntFilter
      : T[K] extends boolean
        ? BooleanFilter
        : unknown
}
