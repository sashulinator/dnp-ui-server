import { Controller, Post, Body, Put, Param, Delete, Get } from '@nestjs/common'
import {
  TranslationOrderByWithRelationInput,
  TranslationWhereInput,
  TranslationWhereUniqueInput,
  TranslationsService,
  TranslationUpdateInput,
  TranslationCreateInput,
} from './translations.service'
import { Translation } from '@prisma/client'

@Controller('api/v1/translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

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
      cursor?: TranslationWhereUniqueInput
      where?: TranslationWhereInput
      orderBy?: TranslationOrderByWithRelationInput
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
  update(@Param('id') id: string, @Body() translationUpdateInput: TranslationUpdateInput) {
    return this.translationsService.update({ id: Number(id) }, translationUpdateInput)
  }

  @Post()
  create(@Body() translationCreateInput: TranslationCreateInput) {
    return this.translationsService.create(translationCreateInput)
  }
}
