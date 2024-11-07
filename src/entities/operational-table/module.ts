import { Module } from '@nestjs/common'

import Database from '~/slices/database'
import { EngineModule } from '~/slices/engine'
import ExplorerModule from '~/slices/explorer/module'
import PrismaModule from '~/slices/prisma/module'

import ProcessModule from '../processes/module'
import Controller from './controller'
import ExplorerController from './controller.explorer'
import Service from './service'
import ExplorerService from './service.explorer'

@Module({
  controllers: [ExplorerController, Controller],
  providers: [Service, ExplorerService, Database],
  imports: [PrismaModule, ExplorerModule, ProcessModule, EngineModule],
  exports: [Service, ExplorerService],
})
export default class OperationalTableModule {}
