import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Search,
  Get,
} from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { Prisma, Translation } from '@prisma/client';

@Controller('api/v1/translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Post()
  create(@Body() TranslationCreateInput: Prisma.TranslationCreateInput) {
    return this.translationsService.create(TranslationCreateInput);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.translationsService.findOne({ id: Number(id) });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() translationUpdateInput: Prisma.TranslationUpdateInput,
  ) {
    return this.translationsService.update(
      { id: Number(id) },
      translationUpdateInput,
    );
  }

  @Search()
  async findAll(
    @Body()
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.TranslationWhereUniqueInput;
      where?: Prisma.TranslationWhereInput;
      orderBy?: Prisma.TranslationOrderByWithRelationInput;
    } = {},
  ): Promise<{ data: Translation[]; total: number }> {
    const [data, total] = await this.translationsService.findAll(params);

    return { data, total };
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.translationsService.remove({ id });
  }
}
