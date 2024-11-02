import { Body, Delete, Get, Controller as NestJSController, Param, Post, Put, Search, UsePipes } from '@nestjs/common'
import type { Process } from '@prisma/client'
import { type NormalizationConfig } from '@prisma/client'

import * as v from 'valibot'

import { ValibotPipe } from '~/app/valibot.pipe'

import {
  type CreateNormalizationConfig,
  type UpdateNormalizationConfig,
  createNormalizationConfigSchema,
  updateNormalizationConfigSchema,
} from './dto'
import Service, { type OrderByWithRelationInput, type Select, type WhereInput, type WhereUniqueInput } from './service'

@NestJSController('api/v1/normalization-configs')
export default class Controller {
  constructor(private readonly service: Service) {}

  @Get(':id/run')
  run(@Param('id') id: string): Promise<{ process: Process }> {
    return this.service.run({ id })
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<NormalizationConfig> {
    return this.service.remove({ id })
  }

  @Put()
  @UsePipes(new ValibotPipe(v.object({ input: updateNormalizationConfigSchema })))
  update(@Body() body: { input: UpdateNormalizationConfig }): Promise<NormalizationConfig> {
    return this.service.update({ id: body.input.id }, body.input)
  }

  @Post()
  @UsePipes(new ValibotPipe(v.object({ input: createNormalizationConfigSchema })))
  create(@Body() body: { input: CreateNormalizationConfig }): Promise<NormalizationConfig> {
    return this.service.create(body.input)
  }

  @Get(':id')
  getByName(@Param('id') id: string): Promise<NormalizationConfig> {
    return this.service.getFirst({ id })
  }

  @Search('first')
  findFirst(
    @Body()
    params: {
      where?: WhereInput
      select?: Select
    } = {},
  ): Promise<NormalizationConfig> {
    return this.service.findFirst(params)
  }

  @Search()
  async findAndCountMany(
    @Body()
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
      select?: Select
    } = {},
  ): Promise<{ items: NormalizationConfig[]; total: number }> {
    const [items, total] = await this.service.findAndCountMany(params)

    return { items, total }
  }
}
