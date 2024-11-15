import type {
  AnalyticalActions,
  DictionaryTable,
  NormalizationConfig,
  OperationalTable,
  Prisma,
  Process,
  RawTable,
  Store,
  StoreConfig,
  TargetTable,
  Translation,
  User,
} from '@prisma/client'

import { check } from '~/utils/types/test'

export type EntityMap = {
  user: User
  storeConfig: StoreConfig
  normalizationConfig: NormalizationConfig
  rawTable: RawTable
  dictionaryTable: DictionaryTable
  targetTable: TargetTable
  operationalTable: OperationalTable
  analyticalActions: AnalyticalActions
  // System
  process: Process
  store: Store
  translation: Translation
}

// В случае изменений Prisma схемы, здесь появится ошибка
check<keyof EntityMap, Uncapitalize<keyof Prisma.TypeMap['model']>, 1>(
  '' as Uncapitalize<keyof Prisma.TypeMap['model']>,
)
