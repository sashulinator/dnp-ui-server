import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import { AnalyticalActionsModule, AnalyticsModule } from '~/entities/analytics'
import { DcserviceModule } from '~/entities/database-container'
import DictionaryTableModule from '~/entities/dictionary-table/nest.module'
import NormalizationConfigModule from '~/entities/normalization-configs/module'
import OperationalTablesModule from '~/entities/operational-table/module'
import RawTablesModule from '~/entities/raw-table/nest.module'
import StoreConfigModule from '~/entities/store-configs/module'
import TargetTablesModule from '~/entities/target-table/module'
import ExplorerModule from '~/slices/explorer/module'
import { FileModule } from '~/slices/files'
import { PrismaModule } from '~/slices/prisma'
import { ProcessModule } from '~/slices/process/nest.module'
import { StoreModule } from '~/slices/store'
import TranslationsModule from '~/slices/translations/module'

import AppController from './controller'
import ExceptionFilter from './exception.filter'

@Module({
  controllers: [AppController],
  imports: [
    DcserviceModule,
    AnalyticalActionsModule,
    AnalyticsModule,
    DictionaryTableModule,
    FileModule,
    NormalizationConfigModule,
    OperationalTablesModule,
    RawTablesModule,
    StoreConfigModule,
    TargetTablesModule,
    ExplorerModule,

    /** slices */
    PrismaModule,

    /** system slices */
    ProcessModule,
    StoreModule,
    TranslationsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export default class AppModule {}
