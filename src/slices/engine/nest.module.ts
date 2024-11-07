import { Module as NestModule } from '@nestjs/common'

import MinioModule from '~/slices/minio/module'

import Service from './nest.service'

@NestModule({
  providers: [Service],
  imports: [MinioModule],
  exports: [Service],
})
export default class Module {}
