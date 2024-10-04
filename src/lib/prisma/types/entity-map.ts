import type {
  DictionaryTable,
  NormalizationConfig,
  OperationalTable,
  Prisma,
  Process,
  ProcessEvent,
  StoreConfig,
  TargetTable,
  Translation,
  User,
} from '@prisma/client'

import { check } from '~/utils/types/test'

export type EntityMap = {
  user: User
  process: Process
  processEvent: ProcessEvent
  storeConfig: StoreConfig
  normalizationConfig: NormalizationConfig
  targetTable: TargetTable
  operationalTable: OperationalTable
  dictionaryTable: DictionaryTable
  translation: Translation
}

// В случае изменений Prisma схемы, здесь появится ошибка
check<keyof EntityMap, Uncapitalize<keyof Prisma.TypeMap['model']>, 1>(
  '' as Uncapitalize<keyof Prisma.TypeMap['model']>,
)
