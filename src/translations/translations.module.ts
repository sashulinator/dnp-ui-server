import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { Controller } from './translations.controller'
import { Service } from './translations.service'

@Module({
  controllers: [Controller],
  providers: [Service, PrismaService],
})
export class TranslationsModule {}
