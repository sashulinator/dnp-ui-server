import { type OneKey } from '../../dictionary'

export type Is = 'is' | 'not'

export type IsFilter = OneKey<Is, string | number | null>
