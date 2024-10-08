import { Module } from '@nestjs/common'

import Database from '~/shared/database'
import ExplorerModule from '~/shared/explorer/module'
import PrismaModule from '~/shared/prisma/module'

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
export default class DictionaryTableModule {}
