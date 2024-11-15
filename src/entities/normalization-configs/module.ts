import { Module } from '@nestjs/common'

import { EngineModule } from '~/slices/engine'
import MinioModule from '~/slices/minio/module'
import { PrismaModule } from '~/slices/prisma'
import { ProcessModule } from '~/slices/process'

import Controller from './controller'
import Service from './service'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [EngineModule, PrismaModule, ProcessModule, MinioModule],
})
export default class NormalizationConfigModule {}
