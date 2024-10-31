import { Body, Get, Controller as NestJSController, Param, Put } from '@nestjs/common'

import { type UpdateBaseHeapSchema } from '~/common/entities/heap'

import type { Heap } from './service'
import Service from './service'

@NestJSController('api/v1/heaps')
export class Controller {
  constructor(private readonly service: Service) {}

  /* ------------ GET HEAP BY NAME ------------*/
  @Get(':name')
  get(@Param('name') name: string): Promise<Heap> {
    return this.service.get(name)
  }

  /* ------------ UPDATE HEAP ------------*/
  @Put(':name')
  update(@Param('name') name: string, @Body() body: UpdateBaseHeapSchema): Promise<Heap> {
    return this.service.update(name, body)
  }
}
