import { Module } from '@nestjs/common'

import MinioModule from '~/shared/minio/module'
import PrismaModule from '~/shared/prisma/module'

import Controller from './controller'
import Service from './service'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [PrismaModule, MinioModule],
  exports: [Service],
})
export default class ProcessModule {}
