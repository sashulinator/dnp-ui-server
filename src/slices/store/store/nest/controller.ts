import { Body, Controller as NestJSController, Post } from '@nestjs/common'

import { serialize } from '~/slices/api'

import * as api from '../api.v1'
import { StoreService } from './service'

@NestJSController()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post(api.getByName.url)
  async getByName(@Body('params') params: api.getByName.RequestParams): Promise<api.getByName.Result> {
    const ret = await this.storeService.findUniqueOrThrow({ where: { name: params.name } })
    return serialize<api.getByName.Result>(ret)
  }

  @Post(api.update.url)
  async update(@Body('params') params: api.update.RequestParams): Promise<api.update.Result> {
    const ret = await this.storeService.update({
      where: { name: params.input.name },
      data: params.input,
    })
    return serialize<api.update.Result>(ret)
  }
}
