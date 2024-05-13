import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ExceptionFilter } from './exception.filter'
import { TranslationsModule } from './translations/translations.module'

@Module({
  imports: [TranslationsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
