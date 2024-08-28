import { Module } from '@nestjs/common'

import Service from './service'
import Controller from './controller'
import PrismaModule from '../../shared/prisma/module'
import Database from '~/lib/database'

@Module({
  controllers: [Controller],
  providers: [Service, Database],
  imports: [PrismaModule],
  exports: [Service],
})
export default class ExplorerModule {}
