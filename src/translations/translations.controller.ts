import { Controller as NestJSController, Post, Body, Put, Param, Delete, Get } from '@nestjs/common'
import {
  OrderByWithRelationInput,
  WhereInput,
  WhereUniqueInput,
  Service,
  UpdateInput,
  CreateInput,
} from './translations.service'
import { Translation } from '@prisma/client'

@NestJSController('api/v1/translations')
export class Controller {
  constructor(private readonly translationsService: Service) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.translationsService.getUniq({ id: Number(id) })
  }

  @Get()
  async findAndCountMany(
    @Body()
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
    } = {}
  ): Promise<{ data: Translation[]; total: number }> {
    const [data, total] = await this.translationsService.findAndCountMany(params)

    return { data, total }
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.translationsService.remove({ id })
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() translationUpdateInput: UpdateInput) {
    return this.translationsService.update({ id: Number(id) }, translationUpdateInput)
  }

  @Post()
  create(@Body() translationCreateInput: CreateInput) {
    return this.translationsService.create(translationCreateInput)
  }
}
