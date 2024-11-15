import { Body, Get, Controller as NestJSController, Param, Put } from '@nestjs/common'

import { type UpdateStoreSchema } from '~/common/slices/store'

import type { Store } from './service'
import Service from './service'

@NestJSController('api/v1/stores')
export class Controller {
  constructor(private readonly service: Service) {}

  /* ------------ GET HEAP BY NAME ------------*/
  @Get(':name')
  get(@Param('name') name: string): Promise<Store> {
    return this.service.getUnique({ where: { name } })
  }

  /* ------------ UPDATE HEAP ------------*/
  @Put(':name')
  update(@Param('name') name: string, @Body() body: UpdateStoreSchema): Promise<Store> {
    return this.service.update({ where: { name }, data: body })
  }
}
