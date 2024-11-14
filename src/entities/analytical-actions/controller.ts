import { Controller as NestJSController, Post } from '@nestjs/common'

import type { AnalyticalActions } from './service'
import Service from './service'

@NestJSController('api/v1/analytical-actions')
export class Controller {
  constructor(private readonly service: Service) {}

  @Post('/find-many')
  findMany(): Promise<AnalyticalActions[]> {
    return this.service.findMany()
  }
}
