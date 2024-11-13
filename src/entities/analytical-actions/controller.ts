import { Get, Controller as NestJSController } from '@nestjs/common'

import type { AnalyticalActions } from './service'
import Service from './service'

@NestJSController('api/v1/analytical-actions')
export class Controller {
  constructor(private readonly service: Service) {}

  /* ------------ GET ANALYTICAL ACTIONS ------------*/
  @Get()
  get(): Promise<AnalyticalActions[]> {
    return this.service.findMany()
  }
}
