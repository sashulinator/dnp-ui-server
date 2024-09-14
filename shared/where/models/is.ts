import { has } from '~/utils/core'

import { type MatchMode } from './match-mode'

export function isContainsMatch(input: unknown): input is MatchMode & { contains: string } {
  return has(input, 'contains')
}

export function isStartsWithMatch(input: unknown): input is MatchMode & { startsWith: string } {
  return has(input, 'startsWith')
}

export function isEndsWithMatch(input: unknown): input is MatchMode & { endsWith: string } {
  return has(input, 'endsWith')
}
