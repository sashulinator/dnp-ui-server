import { Body, Get, Controller as NestJSController, Param, Put } from '@nestjs/common'

import { type UpdateHeapSchema } from '~/common/entities/heap'

import type { Heap } from './service'
import Service from './service'

@NestJSController('api/v1/heaps')
export class Controller {
  constructor(private readonly service: Service) {}

  /* ------------ GET HEAP BY NAME ------------*/
  @Get(':name')
  get(@Param('name') name: string): Promise<Heap> {
    return this.service.getUnique({ where: { name } })
  }

  /* ------------ UPDATE HEAP ------------*/
  @Put(':name')
  update(@Param('name') name: string, @Body() body: UpdateHeapSchema): Promise<Heap> {
    return this.service.update({ where: { name }, data: body })
  }
}
