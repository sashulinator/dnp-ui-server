import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Prisma, Translation } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { isInstanceOf } from 'src/utils/core'

const TAKE = 100

export type WhereUniqueInput = Prisma.TranslationWhereUniqueInput
export type WhereInput = Prisma.TranslationWhereInput
export type OrderByWithRelationInput = Prisma.TranslationOrderByWithRelationInput
export type CreateInput = Prisma.TranslationCreateInput
export type UpdateInput = Prisma.TranslationUpdateInput

@Injectable()
export class Service {
  constructor(private prisma: PrismaService) {}

  /**
   * GET
   */

  async getFirst(whereUniqInput: WhereUniqueInput): Promise<Translation> {
    return this.prisma.translation
      .findFirstOrThrow({
        where: whereUniqInput,
      })
      .catch((error) => {
        if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
        throw new HttpException('Not found', HttpStatus.NOT_FOUND)
      })
  }

  async getUniq(translationWhereUniqInput: WhereUniqueInput): Promise<Translation> {
    return this.prisma.translation
      .findUniqueOrThrow({
        where: translationWhereUniqInput,
      })
      .catch((error) => {
        if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
        throw new HttpException('Not found', HttpStatus.NOT_FOUND)
      })
  }

  /**
   * FIND
   */

  async findFirst(whereInput: WhereInput): Promise<Translation | null> {
    return this.prisma.translation.findFirst({
      where: whereInput,
    })
  }

  async findUnique(whereUniqInput: WhereUniqueInput): Promise<Translation | null> {
    return this.prisma.translation.findUnique({
      where: whereUniqInput,
    })
  }

  async findMany(
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
    } = {}
  ): Promise<Translation[]> {
    const { skip, take = TAKE, cursor, where, orderBy } = params

    return this.prisma.translation.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  /**
   * Find many translations and return the total count of the results
   *
   * @param params.skip The number of results to skip
   * @param params.take The number of results to return
   * @param params.cursor The cursor to start from
   * @param params.where A WHERE clause for the query
   * @param params.orderBy An ORDER BY clause for the query
   * @returns A promise containing the translations and the total count of the results
   */
  async findAndCountMany(
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
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

    return this.prisma.$transaction([
      this.prisma.translation.findMany(args), // Find the translations
      this.prisma.translation.count(args), // Count the total number of results
    ])
  }

  /**
   * CREATE
   */

  async create(data: CreateInput) {
    const item = await this.prisma.translation.findFirst({
      where: { key: data.key, AND: { locale: data.locale, AND: { ns: data.ns } } },
    })

    if (item) throw new HttpException('Already exists', HttpStatus.CONFLICT)

    return this.prisma.translation.create({
      data,
    })
  }

  /**
   * UPDATE
   */

  async update(where: WhereUniqueInput, data: UpdateInput): Promise<Translation> {
    return this.prisma.translation.update({
      data,
      where,
    })
  }

  /**
   * REMOVE
   */

  async remove(where: WhereUniqueInput): Promise<Translation> {
    return this.prisma.translation.delete({
      where,
    })
  }
}
