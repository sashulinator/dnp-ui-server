import { type OneKey } from '../../dictionary'

export const IS = { is: 'is', not: 'not' } as const

export type IsKey = keyof typeof IS

export type IsFilter = OneKey<IsKey, string | number | null>
