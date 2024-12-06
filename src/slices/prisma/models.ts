import type {
  AnalyticalActions,
  DcColumn,
  DcDatabase,
  DcSchema,
  DcService,
  DcTable,
  DictionaryTable,
  NormalizationConfig,
  OperationalTable,
  Prisma,
  Process,
  QueryFilter,
  RawTable,
  Store,
  StoreConfig,
  TargetTable,
  Translation,
  User,
} from '@prisma/client'

import { check } from '~/utils/types/test'

export type EntityMap = {
  // DatabaseContainer
  dcColumn: DcColumn
  dcDatabase: DcDatabase
  dcSchema: DcSchema
  dcService: DcService
  dcTable: DcTable
  // System
  process: Process
  store: Store
  translation: Translation
  queryFilter: QueryFilter
  // other
  user: User
  storeConfig: StoreConfig
  normalizationConfig: NormalizationConfig
  rawTable: RawTable
  dictionaryTable: DictionaryTable
  targetTable: TargetTable
  operationalTable: OperationalTable
  analyticalActions: AnalyticalActions
}

// В случае изменений Prisma схемы, здесь появится ошибка
check<keyof EntityMap, Uncapitalize<keyof Prisma.TypeMap['model']>, 1>(
  '' as Uncapitalize<keyof Prisma.TypeMap['model']>,
)
