import { Controller as NestJSController, Get } from '@nestjs/common'

import { Service } from './service'

@NestJSController('api/v1/explorer')
export class Controller {
  constructor(private readonly service: Service) {}

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById(): Promise<any> {
    return this.service.getTables()
  }
}
