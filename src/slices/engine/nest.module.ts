import { Module as NestModule } from '@nestjs/common'

import MinioModule from '~/shared/minio/module'

import Service from './nest.service'

@NestModule({
  providers: [Service],
  imports: [MinioModule],
  exports: [Service],
})
export default class Module {}
