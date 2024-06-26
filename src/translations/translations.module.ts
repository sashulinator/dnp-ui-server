import { Module } from '@nestjs/common'

import { Controller } from './translations.controller'
import { Service } from './translations.service'
import PrismaModule from '~/prisma/prisma.module'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [PrismaModule],
})
export class TranslationsModule {}
