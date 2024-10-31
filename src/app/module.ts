import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import DictionaryTableModule from '../entities/dictionary-table/nest.module'
import FilesModule from '../entities/files/module'
import HeapModule from '../entities/heap/module'
import NormalizationConfigModule from '../entities/normalization-configs/module'
import OperationalTablesModule from '../entities/operational-table/module'
import ProcessModule from '../entities/processes/module'
import StoreConfigModule from '../entities/store-configs/module'
import TargetTablesModule from '../entities/target-table/module'
import ExplorerModule from '../shared/explorer/module'
import PrismaModule from '../shared/prisma/module'
import TranslationsModule from '../shared/translations/module'
import AppController from './controller'
import ExceptionFilter from './exception.filter'

@Module({
  controllers: [AppController],
  imports: [
    PrismaModule,
    NormalizationConfigModule,
    OperationalTablesModule,
    DictionaryTableModule,
    ProcessModule,
    StoreConfigModule,
    TranslationsModule,
    TargetTablesModule,
    ExplorerModule,
    FilesModule,
    HeapModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export default class AppModule {}
