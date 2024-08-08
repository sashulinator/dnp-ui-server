import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import AppController from './controller'
import ExceptionFilter from './exception.filter'
import NormalizationConfigModule from '../entities/normalization-configs/module'
import ProcessModule from '../entities/processes/module'
import StoreConfigModule from '../entities/store-configs/module'
import PrismaModule from '../shared/prisma/module'
import ExplorerModule from '../entities/explorer/module'
import TargetTablesModule from '../entities/target-table/module'
import OperationalTablesModule from '../entities/operational-table/module'
import TranslationsModule from '../system/translations/module'

@Module({
  controllers: [AppController],
  imports: [
    PrismaModule,

    NormalizationConfigModule,
    OperationalTablesModule,
    ProcessModule,
    StoreConfigModule,
    TranslationsModule,
    TargetTablesModule,
    ExplorerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export default class AppModule {}
