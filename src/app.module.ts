import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import { ExceptionFilter } from './exception.filter'
import { NormalizationConfigModule } from './normalization-configs/normalization-configs.module'
import { TranslationsModule } from './translations/translations.module'

@Module({
  imports: [TranslationsModule, NormalizationConfigModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
