import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationsModule } from './translations/translations.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilter } from './exception.filter';

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
