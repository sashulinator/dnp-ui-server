export type Sort = Record<string, SortValue | undefined>

export type SortValue = 'asc' | 'desc'

export type ToSort<T extends Record<string, unknown>> = Partial<Record<keyof T, SortValue | undefined>>
