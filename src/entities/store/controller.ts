import { Body, Controller as NestJSController, Param, Post } from '@nestjs/common'

import { type UpdateStoreSchema } from '~/common/slices/store'

import type { Store } from './service'
import Service from './service'

@NestJSController('api/v1/stores')
export class Controller {
  constructor(private readonly service: Service) {}

  @Post('get-unique/:name')
  getUnique(@Param('name') name: string): Promise<Store> {
    return this.service.getUnique(name)
  }

  @Post('update/:name')
  update(@Param('name') name: string, @Body() body: UpdateStoreSchema): Promise<Store> {
    return this.service.update(name, body)
  }
}
