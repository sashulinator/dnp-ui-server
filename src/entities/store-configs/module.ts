import { Module } from '@nestjs/common'
import PrismaModule from '../../shared/prisma/module'
import ExplorerModule from '../explorer/module'
import Controller from './controller'
import Service from './service'
import StoreConfigExplorerService from './service.explorer'
import StoreConfigExplorerController from './controller.explorer'

@Module({
  controllers: [StoreConfigExplorerController, Controller],
  providers: [Service, StoreConfigExplorerService],
  imports: [PrismaModule, ExplorerModule],
  exports: [Service, StoreConfigExplorerService],
})
export default class StoreConfigModule {}
