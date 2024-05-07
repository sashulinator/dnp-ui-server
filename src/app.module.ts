import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationsModule } from './translations/translations.module';

@Module({
  imports: [TranslationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
