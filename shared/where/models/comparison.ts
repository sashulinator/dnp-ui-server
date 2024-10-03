export const COMPARISON = { equals: 'equals', lt: 'lt', lte: 'lte', gt: 'gt', gte: 'gte' } as const

export type ComparisonKey = keyof typeof COMPARISON
