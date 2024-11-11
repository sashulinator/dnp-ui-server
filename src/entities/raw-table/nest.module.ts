import { Module } from '@nestjs/common'

import Database from '~/slices/database'
import ExplorerModule from '~/slices/explorer/module'
import PrismaModule from '~/slices/prisma/module'

import Controller from './nest.controller'
import ExplorerController from './nest.controller.explorer'
import Service from './nest.service'
import ExplorerService from './nest.service.explorer'

@Module({
  controllers: [ExplorerController, Controller],
  providers: [Service, ExplorerService, Database],
  imports: [PrismaModule, ExplorerModule],
  exports: [Service, ExplorerService],
})
export default class RawTableModule {}
