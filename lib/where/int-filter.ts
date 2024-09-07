import type { Comparison } from './comparison'
import type { In } from './in'

export type IntFilter = Comparison<number> | In<number>
// Вдохновлялся типами prisma, пока что не понимаю зачем ей not в Filter если есть NOT в where
// & { not?: Comparison<number> & In<number> }
