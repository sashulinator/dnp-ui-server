import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import AppController from './app.controller'
import { ExceptionFilter } from './exception.filter'
import { NormalizationConfigArchiveModule } from './normalization-configs-archive/normalization-configs-archive.module'
import { NormalizationConfigModule } from './normalization-configs/normalization-configs.module'
import { TranslationsModule } from './translations/translations.module'

@Module({
  controllers: [AppController],
  imports: [TranslationsModule, NormalizationConfigModule, NormalizationConfigArchiveModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
