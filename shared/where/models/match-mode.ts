export const MATCH_MODE = { notMode: 'notMode', caseSensitive: 'caseSensitive' } as const

export type MatchModeKey = keyof typeof MATCH_MODE

export type MatchMode = Partial<Record<MatchModeKey, boolean>>
