import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import AppController from './app.controller'
import { ExceptionFilter } from './exception.filter'
import { NormalizationConfigArchiveModule } from './entities/normalization-configs-archive/normalization-configs-archive.module'
import { NormalizationConfigModule } from './entities/normalization-configs/normalization-configs.module'
import { ProcessModule } from './entities/processes/processes.module'
import SourceModule from './entities/store-configs/store-configs.module'
import PrismaModule from './prisma/prisma.module'
import ExplorerModule from './explorer/explorer.module'
import { TranslationsModule } from './translations/translations.module'

@Module({
  controllers: [AppController],
  imports: [
    TranslationsModule,
    NormalizationConfigModule,
    NormalizationConfigArchiveModule,
    ProcessModule,
    SourceModule,
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
export class AppModule {}
