import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import AppController from './controller'
import ExceptionFilter from './exception.filter'
import NormalizationConfigArchiveModule from '../entities/normalization-configs-archive/module'
import NormalizationConfigModule from '../entities/normalization-configs/module'
import ProcessModule from '../entities/processes/module'
import StoreConfigModule from '../entities/store-configs/module'
import PrismaModule from '../shared/prisma/module'
import ExplorerModule from '../procedures/explorer/module'
import TranslationsModule from '../system/translations/module'

@Module({
  controllers: [AppController],
  imports: [
    TranslationsModule,
    NormalizationConfigModule,
    NormalizationConfigArchiveModule,
    ProcessModule,
    StoreConfigModule,
    PrismaModule,
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
