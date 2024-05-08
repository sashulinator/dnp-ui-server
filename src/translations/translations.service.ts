import { Injectable } from '@nestjs/common'
import { Prisma, Translation } from '@prisma/client'
import { PrismaService } from '../prisma.service'

const TAKE = 100

@Injectable()
export class TranslationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * GET
   */

  async getFirst(translationWhereUniqInput: Prisma.TranslationWhereUniqueInput): Promise<Translation> {
    return this.prisma.translation.findFirstOrThrow({
      where: translationWhereUniqInput,
    })
  }

  async getUniq(translationWhereUniqInput: Prisma.TranslationWhereUniqueInput): Promise<Translation> {
    return this.prisma.translation.findUniqueOrThrow({
      where: translationWhereUniqInput,
    })
  }

  /**
   * FIND
   */

  async findFirst(translationWhereInput: Prisma.TranslationWhereInput): Promise<Translation | null> {
    return this.prisma.translation.findFirst({
      where: translationWhereInput,
    })
  }

  async findUnique(translationWhereUniqInput: Prisma.TranslationWhereUniqueInput): Promise<Translation | null> {
    return this.prisma.translation.findUnique({
      where: translationWhereUniqInput,
    })
  }

  async findAll(
    params: {
      skip?: number
      take?: number
      cursor?: Prisma.TranslationWhereUniqueInput
      where?: Prisma.TranslationWhereInput
      orderBy?: Prisma.TranslationOrderByWithRelationInput
    } = {}
  ): Promise<[Translation[], number]> {
    const { skip, take = TAKE, cursor, where, orderBy } = params

    const args = {
      skip,
      take,
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([this.prisma.translation.findMany(args), this.prisma.translation.count(args)])
  }

  async create(data: Prisma.TranslationCreateInput) {
    return this.prisma.translation.create({
      data,
    })
  }

  async update(where: Prisma.TranslationWhereUniqueInput, data: Prisma.TranslationUpdateInput): Promise<Translation> {
    return this.prisma.translation.update({
      data,
      where,
    })
  }

  async remove(where: Prisma.TranslationWhereUniqueInput): Promise<Translation> {
    return this.prisma.translation.delete({
      where,
    })
  }
}
