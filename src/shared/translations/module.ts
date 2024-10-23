import { Module } from '@nestjs/common'

import PrismaModule from '~/shared/prisma/module'

import { Controller } from './controller'
import Service from './service'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [PrismaModule],
})
export default class TranslationModule {}
