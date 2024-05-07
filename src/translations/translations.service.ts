import { Injectable } from '@nestjs/common';
import { Prisma, Translation } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TranslationsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.TranslationCreateInput) {
    return this.prisma.translation.create({
      data,
    });
  }

  findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.TranslationWhereUniqueInput;
      where?: Prisma.TranslationWhereInput;
      orderBy?: Prisma.TranslationOrderByWithRelationInput;
    } = {},
  ): Promise<[Translation[], number]> {
    const { skip, take = 100, cursor, where, orderBy } = params;

    const args = {
      skip,
      take,
      cursor,
      where,
      orderBy,
    };

    return this.prisma.$transaction([
      this.prisma.translation.findMany(args),
      this.prisma.translation.count(args),
    ]);
  }

  findOne(
    translationWhereUniqueInput: Prisma.TranslationWhereUniqueInput,
  ): Promise<Translation | null> {
    return this.prisma.translation.findFirst({
      where: translationWhereUniqueInput,
    });
  }

  update(
    where: Prisma.TranslationWhereUniqueInput,
    data: Prisma.TranslationUpdateInput,
  ): Promise<Translation> {
    return this.prisma.translation.update({
      data,
      where,
    });
  }

  remove(where: Prisma.TranslationWhereUniqueInput): Promise<Translation> {
    return this.prisma.translation.delete({
      where,
    });
  }
}
