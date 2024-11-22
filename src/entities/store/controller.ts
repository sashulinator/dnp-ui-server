import { Body, Controller as NestJSController, Param, Post } from '@nestjs/common'

import { type UpdateStoreSchema } from '~/common/slices/store'

import type { Store } from './service'
import Service from './service'

@NestJSController('api/v1/stores')
export class Controller {
  constructor(private readonly service: Service) {}

  @Post('get-unique')
  getUnique(@Param('name') name: string): Promise<Store> {
    return this.service.getUnique(name)
  }

  @Post('update')
  update(@Body() body: { data: UpdateStoreSchema }): Promise<Store> {
    return this.service.update(body.data)
  }
}
