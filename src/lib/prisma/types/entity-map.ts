import type {
  Process,
  NormalizationConfig,
  User,
  StoreConfig,
  Prisma,
  Table,
  Entity,
  IoConfig,
  Translation,
} from '@prisma/client'
import { check } from '~/utils/types/test'

export type EntityMap = {
  user: User
  process: Process
  storeConfig: StoreConfig
  normalizationConfig: NormalizationConfig
  table: Table
  entity: Entity
  ioConfig: IoConfig
  translation: Translation
}

// В случае изменений Prisma схемы, здесь появится ошибка
check<keyof EntityMap, Uncapitalize<keyof Prisma.TypeMap['model']>, 1>(
  '' as Uncapitalize<keyof Prisma.TypeMap['model']>
)
