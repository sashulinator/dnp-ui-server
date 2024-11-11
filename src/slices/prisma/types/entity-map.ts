import type {
  DictionaryTable,
  Heap,
  NormalizationConfig,
  OperationalTable,
  Prisma,
  Process,
  RawTable,
  StoreConfig,
  TargetTable,
  Translation,
  User,
} from '@prisma/client'

import { check } from '~/utils/types/test'

export type EntityMap = {
  user: User
  process: Process
  storeConfig: StoreConfig
  normalizationConfig: NormalizationConfig
  rawTable: RawTable
  dictionaryTable: DictionaryTable
  targetTable: TargetTable
  operationalTable: OperationalTable
  translation: Translation
  heap: Heap
}

// В случае изменений Prisma схемы, здесь появится ошибка
check<keyof EntityMap, Uncapitalize<keyof Prisma.TypeMap['model']>, 1>(
  '' as Uncapitalize<keyof Prisma.TypeMap['model']>,
)
