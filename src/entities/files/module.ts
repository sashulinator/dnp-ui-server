import { Module } from '@nestjs/common'

import MinioModule from '~/slices/minio/module'

import Controller from './controller'
import Service from './service'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [MinioModule],
})
export default class ProcessModule {}
