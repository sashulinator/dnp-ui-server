import { Module as NestModule } from '@nestjs/common'

import { Controller } from './controller'
import { Service } from './service'

@NestModule({
  controllers: [Controller],
  providers: [Service],
})
export default class Module {}
