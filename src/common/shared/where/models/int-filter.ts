import { type OneKey } from '../../dictionary'
import type { Comparison } from './comparison'
import type { In } from './in'

export type IntFilter = OneKey<In, number[]> | OneKey<Comparison, string>
