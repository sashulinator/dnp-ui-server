import { Module as NestModule } from '@nestjs/common'

import { Controller } from './explorer.controller'
import { Service } from './explorer.service'

@NestModule({
  controllers: [Controller],
  providers: [Service],
})
export default class Module {}
