import { Module } from '@nestjs/common'

import Database from '~/slices/database'
import ExplorerModule from '~/slices/explorer/module'
import { PrismaModule } from '~/slices/prisma'

import Controller from './controller'
import ExplorerController from './controller.explorer'
import Service from './service'
import ExplorerService from './service.explorer'

@Module({
  controllers: [ExplorerController, Controller],
  providers: [Service, ExplorerService, Database],
  imports: [PrismaModule, ExplorerModule],
  exports: [Service, ExplorerService],
})
export default class TargetTableModule {}
