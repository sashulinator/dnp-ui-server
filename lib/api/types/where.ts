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

export type StringFilter = ComparisonFilter<string> &
  InFilter<string> &
  MatchFilter &
  QueryModeFilter & {
    not?: (ComparisonFilter<string> & InFilter<string> & MatchFilter & QueryModeFilter) | string
  }

export type IntFilter = ComparisonFilter<number> &
  InFilter<number> & {
    not?: ComparisonFilter<number> & InFilter<number>
  }

export type BooleanFilter = {
  equals?: boolean
  not?: boolean
}

export interface QueryModeFilter {
  mode?: QueryMode
}

export interface ComparisonFilter<T extends string | number> {
  equals?: T
  lt?: T
  lte?: T
  gt?: T
  gte?: T
}

export interface InFilter<T extends string | number> {
  in?: T[]
  notIn?: T[]
}

export interface MatchFilter {
  contains?: string
  startsWith?: string
  endsWith?: string
}

export const StringFilterPrimitive = {
  equals: 'equals',
  lt: 'lt',
  lte: 'lt',
  gt: 'gt',
  gte: 'gte',
  contains: 'contains',
  startsWith: 'startsWith',
}

export const QUERY_MODE = {
  DEFAULT: 'default',
  INSENSITIVE: 'insensitive',
}

export type QueryMode = (typeof QUERY_MODE)[keyof typeof QUERY_MODE]
