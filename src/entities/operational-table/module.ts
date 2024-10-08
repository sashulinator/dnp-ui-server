import { Module } from '@nestjs/common'

import Database from '~/shared/database'
import ExplorerModule from '~/shared/explorer/module'
import MinioModule from '~/shared/minio/module'
import PrismaModule from '~/shared/prisma/module'

import ProcessModule from '../processes/module'
import Controller from './controller'
import ExplorerController from './controller.explorer'
import Service from './service'
import ExplorerService from './service.explorer'

@Module({
  controllers: [ExplorerController, Controller],
  providers: [Service, ExplorerService, Database],
  imports: [PrismaModule, ExplorerModule, ProcessModule, MinioModule],
  exports: [Service, ExplorerService],
})
export default class OperationalTableModule {}
