export const MATCH = { match: 'match', contains: 'contains', startsWith: 'startsWith', endsWith: 'endsWith' } as const

export type MatchKey = keyof typeof MATCH
