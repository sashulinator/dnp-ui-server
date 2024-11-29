import { Body, Controller as NestJSController, Post } from '@nestjs/common'

import { serialize } from '~/slices/api'

import * as api from '../api.v1'
import { DcserviceService } from './service'

@NestJSController()
export class DcserviceController {
  constructor(private readonly storeService: DcserviceService) {}

  @Post(api.getById.url)
  async getByName(@Body('params') params: api.getById.RequestParams): Promise<api.getById.Result> {
    const ret = await this.storeService.findUniqueOrThrow({ where: { id: params.id } })
    return serialize<api.getById.Result>(ret)
  }

  @Post(api.update.url)
  async update(@Body('params') params: api.update.RequestParams): Promise<api.update.Result> {
    const ret = await this.storeService.update({
      where: { id: params.input.id },
      data: params.input,
    })
    return serialize<api.update.Result>(ret)
  }
}
