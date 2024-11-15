import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Prisma, type Translation } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import { PrismaService } from '~/slices/prisma'

const TAKE = 100

export type WhereUniqueInput = Prisma.TranslationWhereUniqueInput
export type WhereInput = Prisma.TranslationWhereInput
export type OrderByWithRelationInput = Prisma.TranslationOrderByWithRelationInput
export type CreateInput = Prisma.TranslationCreateInput
export type UpdateInput = Prisma.TranslationUpdateInput

@Injectable()
export default class Service {
  constructor(private prisma: PrismaService) {}

  /**
   * GET
   */

  /**
   * Find the first translation that matches the given `whereUniqueInput`.
   * If no translation is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<Translation>} The found translation
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no translation is found
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

  /**
   * Find the unique translation that matches the given `whereUniqueInput`.
   * If no translation is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<Translation>} The found translation
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no translation is found
   */
  async getUniq(whereUniqInput: WhereUniqueInput): Promise<Translation> {
    return this.prisma.translation
      .findUniqueOrThrow({
        where: whereUniqInput,
      })
      .catch((error) => {
        if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
        throw new HttpException('Not found', HttpStatus.NOT_FOUND)
      })
  }

  /**
   * FIND
   */

  /**
   * Find the first translation that matches the given `whereInput`
   *
   * @param {WhereInput} whereInput The `whereInput` to match
   * @returns {Promise<Translation | null>} The found translation or `null` if no translation is found
   */
  async findFirst(whereInput: WhereInput): Promise<Translation | null> {
    return this.prisma.translation.findFirst({
      where: whereInput,
    })
  }

  /**
   * Find the unique translation that matches the given `whereUniqueInput`.
   * If no translation is found, return `null`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<Translation | null>} The found translation or `null` if no translation is found
   */
  async findUnique(whereUniqInput: WhereUniqueInput): Promise<Translation | null> {
    return this.prisma.translation.findUnique({
      where: whereUniqInput,
    })
  }

  /**
   * Find many translations based on the given query parameters
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<Translation[]>} A promise containing the translations
   */
  async findMany(
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
    } = {},
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
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<[Translation[], number]>} A promise containing the translations and the total count of the results
   */
  async findAndCountMany(
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
    } = {},
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

  /**
   * Create a new translation
   *
   * @param {CreateInput} data The data to create the translation with
   * @returns {Promise<Translation>} A promise containing the created translation
   * @throws {HttpException} HttpException with status code 409 if the translation already exists
   */
  async create(data: CreateInput): Promise<Translation> {
    const item = await this.prisma.translation.findFirst({
      where: { key: data.key, AND: { locale: data.locale, AND: { ns: data.ns } } },
    })

    if (item)
      throw new HttpException(
        'A translation with the given key, locale and namespace already exists',
        HttpStatus.CONFLICT,
      )

    return this.prisma.translation.create({
      data,
    })
  }

  /**
   * UPDATE
   */

  /**
   * Update a translation
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @param {UpdateInput} data The data to update the translation with
   * @returns {Promise<Translation>} A promise containing the updated translation
   */
  async update(where: WhereUniqueInput, data: UpdateInput): Promise<Translation> {
    return this.prisma.translation.update({
      data, // The data to update the translation with
      where, // A WHERE clause for the query
    })
  }

  /**
   * REMOVE
   */

  /**
   * Remove a translation
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @returns {Promise<Translation>} A promise containing the removed translation
   */
  async remove(where: WhereUniqueInput): Promise<Translation> {
    return this.prisma.translation.delete({
      where, // A WHERE clause for the query
    })
  }
}
