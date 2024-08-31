export type Where<T extends Record<string, unknown> = Record<string, unknown>> = {
  AND?: Where<T> | Where<T>[]
  OR?: Where<T>[]
  NOT?: Where<T> | Where<T>[]
} & ReplaceValueByFilter<T>

export type ReplaceValueByFilter<T> = {
  [K in keyof T]?: T[K] extends string ? StringFilter : T[K] extends number ? IntFilter : unknown
}

export type StringFilter = {
  equals?: string
  // in?: string[]
  // notIn?: string[]
  lt?: string
  lte?: string
  gt?: string
  gte?: string
  contains?: string
  startsWith?: string
  endsWith?: string
  not?: StringFilter | string
}

export type IntFilter = {
  equals?: number
  in?: number[]
  notIn?: number[]
  lt?: number
  lte?: number
  gt?: number
  gte?: number
  not?: IntFilter
}

// На будущее
// export type BoolFilter = {
//   equals?: boolean
//   not?: boolean
// }
