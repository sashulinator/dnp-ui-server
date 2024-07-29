import { Module } from '@nestjs/common'

import Service from './service'
import Controller from './controller'
import PrismaModule from '../../shared/prisma/module'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [PrismaModule],
  exports: [Service],
})
export default class ExplorerModule {}