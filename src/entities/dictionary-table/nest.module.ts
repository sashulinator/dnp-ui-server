import { Module } from '@nestjs/common'

import Database from '~/slices/database'
import ExplorerModule from '~/slices/explorer/module'
import { PrismaModule } from '~/slices/prisma'

import { ProcessingDataModule, ProcessingDataService } from '../processing-data'
import Controller from './nest.controller'
import ExplorerController from './nest.controller.explorer'
import Service from './nest.service'
import ExplorerService from './nest.service.explorer'

@Module({
  controllers: [ExplorerController, Controller],
  providers: [Service, ExplorerService, Database, ProcessingDataService],
  imports: [PrismaModule, ExplorerModule, ProcessingDataModule],
  exports: [Service, ExplorerService],
})
export default class DictionaryTableModule {}
