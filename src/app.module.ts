import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import AppController from './app.controller'
import { ExceptionFilter } from './exception.filter'
import { NormalizationConfigArchiveModule } from './normalization-configs-archive/normalization-configs-archive.module'
import { NormalizationConfigModule } from './normalization-configs/normalization-configs.module'
import { ProcessModule } from './processes/processes.module'
import SourceModule from './source-configs/source-configs.module'
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
