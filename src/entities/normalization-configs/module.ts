import { Module } from '@nestjs/common'

import { EngineModule } from '~/slices/engine'
import PrismaModule from '~/slices/prisma/module'

import MinioModule from '../../slices/minio/module'
import ProcessModule from '../processes/module'
import Controller from './controller'
import Service from './service'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [EngineModule, PrismaModule, ProcessModule, MinioModule],
})
export default class NormalizationConfigModule {}
