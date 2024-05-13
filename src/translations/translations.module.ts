import { Module } from '@nestjs/common'
import { Service } from './translations.service'
import { Controller } from './translations.controller'
import { PrismaService } from '../prisma.service'

@Module({
  controllers: [Controller],
  providers: [Service, PrismaService],
})
export class TranslationsModule {}
