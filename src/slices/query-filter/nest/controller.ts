import { Body, Controller as NestJSController, Post } from '@nestjs/common'

import { serialize } from '~/slices/api'

import * as api from '../api.v1'
import { QueryFilterService } from './service'

@NestJSController()
export class QueryFilterController {
  constructor(private readonly queryFilterService: QueryFilterService) {}

  @Post(api.getById.url)
  async getById(@Body('params') params: api.getById.RequestParams): Promise<api.getById.Result> {
    const ret = await this.queryFilterService.findUniqueOrThrow({ where: { id: params.id } })
    return serialize<api.getById.Result>(ret)
  }

  @Post(api.update.url)
  async update(@Body('params') params: api.update.RequestParams): Promise<api.update.Result> {
    const ret = await this.queryFilterService.update({
      where: { id: params.input.id },
      data: params.input,
    })
    return serialize<api.update.Result>(ret)
  }

  @Post(api.findWithTotal.url)
  async findWithTotal(@Body('params') params: api.findWithTotal.RequestParams): Promise<api.findWithTotal.Result> {
    const { where, ...manyParams } = params
    const items = await this.queryFilterService.findMany({ ...manyParams, where })
    const total = await this.queryFilterService.count({ where })
    return { items, total }
  }
}
