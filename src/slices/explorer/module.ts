import { Module } from '@nestjs/common'

import Database from '~/slices/database'

import PrismaModule from '../prisma/module'
import Controller from './controller'
import Service from './service'

@Module({
  controllers: [Controller],
  providers: [Service, Database],
  imports: [PrismaModule],
  exports: [Service],
})
export default class ExplorerModule {}
