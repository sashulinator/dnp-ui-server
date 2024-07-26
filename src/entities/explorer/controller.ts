import { Body, Controller as NestJSController, Search } from '@nestjs/common'

import { Service } from './service'

@NestJSController('api/v1/explorer')
export class Controller {
  constructor(private readonly service: Service) {}

  @Search()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getByStoreConfigKn(@Body() body: { storeConfigKn: string; tableName: string }): Promise<any> {
    if (body.tableName) {
      return this.service.getTable(body)
    }
    return this.service.getTables(body)
  }
}
