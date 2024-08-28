import { Module } from '@nestjs/common'
import PrismaModule from '../../shared/prisma/module'
import ExplorerModule from '../explorer/module'
import Controller from './controller'
import Service from './service'
import Database from '~/lib/database'

@Module({
  controllers: [Controller],
  providers: [Service, Database],
  imports: [PrismaModule, ExplorerModule],
  exports: [Service],
})
export default class OperationalTableModule {}
