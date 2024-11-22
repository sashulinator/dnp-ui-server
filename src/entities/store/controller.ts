import { Body, Controller as NestJSController, Post } from '@nestjs/common'

import { type UpdateStoreSchema } from '~/common/slices/store'

import type { Store, UniqueInput } from './service'
import Service from './service'

@NestJSController('api/v1/stores')
export class Controller {
  constructor(private readonly service: Service) {}

  @Post('get-unique')
  getUnique(@Body('name') body: { data: UniqueInput }): Promise<Store> {
    return this.service.findUniqueOrThrow({ where: body.data })
  }

  @Post('update')
  update(@Body() body: { data: { input: UpdateStoreSchema } }): Promise<Store> {
    return this.service.update({
      where: { name: body.data.input.name },
      data: body.data.input,
    })
  }
}
