import { Id } from '~/utils/core'

export interface NormalizationConfig {
  id: Id
  name: string
  createdBy: Id
  updatedBy: Id
  createdAt: string
  updatedAt: string
  data: {
    executables: Executable[]
  } & Record<string, unknown>
}

export interface Executable {
  'computable-config': { 'computable-name': string; version: string }
  'sdk-config': { 'sdk-name': string; version: string }
}
