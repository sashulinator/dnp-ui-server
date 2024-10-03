export const INT_MODE = { notMode: 'notMode' } as const

export type IntModeKey = keyof typeof INT_MODE

export type IntMode = Partial<Record<IntModeKey, boolean>>
