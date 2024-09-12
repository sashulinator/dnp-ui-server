import { Module } from '@nestjs/common'

import ExplorerModule from '../../shared/explorer/module'
import PrismaModule from '../../shared/prisma/module'
import Controller from './controller'
import Service from './service'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [PrismaModule, ExplorerModule],
  exports: [Service],
})
export default class StoreConfigModule {}
