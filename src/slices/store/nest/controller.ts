import { Body, Controller as NestJSController, Post } from '@nestjs/common'

import { Data, serialize } from '~/slices/api'

import * as api from '../api'
import { StoreService } from './service'

@NestJSController(api.v1url)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post(api.getByName.NAME)
  async getByName(@Body('name') body: Data<api.getByName.RequestParams>): Promise<api.getByName.Result> {
    const ret = await this.storeService.findUniqueOrThrow({ where: { name: body.params.name } })
    return serialize<api.getByName.Result>(ret)
  }

  @Post(api.update.NAME)
  async update(@Body() body: Data<api.update.RequestParams>): Promise<api.update.Result> {
    const ret = await this.storeService.update({
      where: { name: body.params.name },
      data: body.params.input,
    })
    return serialize<api.update.Result>(ret)
  }
}
