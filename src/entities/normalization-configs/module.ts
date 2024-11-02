import { Module } from '@nestjs/common'

import PrismaModule from '~/shared/prisma/module'
import { EngineModule } from '~/slices/engine'

import MinioModule from '../../shared/minio/module'
import ProcessModule from '../processes/module'
import Controller from './controller'
import Service from './service'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [EngineModule, PrismaModule, ProcessModule, MinioModule],
})
export default class NormalizationConfigModule {}
