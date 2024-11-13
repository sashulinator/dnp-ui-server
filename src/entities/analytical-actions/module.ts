import { Module } from '@nestjs/common'

import PrismaModule from '~/slices/prisma/module'

import { Controller } from './controller'
import Service from './service'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [PrismaModule],
})
export default class AnalyticalActionsModule {}
