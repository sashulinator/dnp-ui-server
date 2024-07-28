import { Module } from '@nestjs/common'

import { Controller } from './controller'
import Service from './service'
import PrismaModule from '~/shared/prisma/module'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [PrismaModule],
})
export default class TranslationModule {}
