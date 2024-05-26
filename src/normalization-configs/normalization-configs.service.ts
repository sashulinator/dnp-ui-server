import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { NormalizationConfig, Prisma } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import { PrismaService } from '../prisma.service'

export type WhereUniqueInput = Prisma.NormalizationConfigWhereUniqueInput
export type WhereInput = Prisma.NormalizationConfigWhereInput
export type OrderByWithRelationInput = Prisma.NormalizationConfigOrderByWithRelationInput
export type CreateInput = Prisma.NormalizationConfigCreateInput
export type UpdateInput = Prisma.NormalizationConfigUpdateInput
export type Select = Prisma.NormalizationConfigSelect

const TAKE = 100
const ORDER_BY: OrderByWithRelationInput = { updatedAt: 'desc' }

@Injectable()
export class Service {
  constructor(private prisma: PrismaService) {}

  /**
   * GET
   */

  /**
   * Find the first normalizationConfig that matches the given `whereUniqueInput`.
   * If no normalizationConfig is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<NormalizationConfig>} The found normalizationConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no normalizationConfig is found
   */
  async getFirst(whereUniqInput: WhereUniqueInput): Promise<NormalizationConfig> {
    return this.prisma.normalizationConfig
      .findFirstOrThrow({
        where: whereUniqInput,
      })
      .catch((error) => {
        if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
        throw new HttpException('Not found', HttpStatus.NOT_FOUND)
      })
  }

  /**
   * Find the unique normalizationConfig that matches the given `whereUniqueInput`.
   * If no normalizationConfig is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<NormalizationConfig>} The found normalizationConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no normalizationConfig is found
   */
  async getUniq(whereUniqInput: WhereUniqueInput): Promise<NormalizationConfig> {
    return this.prisma.normalizationConfig
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
   * Find the first normalizationConfig that matches the given `whereInput`
   *
   * @param {WhereInput} whereInput The `whereInput` to match
   * @returns {Promise<NormalizationConfig | null>} The found normalizationConfig or `null` if no normalizationConfig is found
   */
  async findFirst(whereInput: WhereInput): Promise<NormalizationConfig | null> {
    return this.prisma.normalizationConfig.findFirst({
      where: whereInput,
    })
  }

  /**
   * Find the unique normalizationConfig that matches the given `whereUniqueInput`.
   * If no normalizationConfig is found, return `null`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<NormalizationConfig | null>} The found normalizationConfig or `null` if no normalizationConfig is found
   */
  async findUnique(whereUniqInput: WhereUniqueInput): Promise<NormalizationConfig | null> {
    return this.prisma.normalizationConfig.findUnique({
      where: whereUniqInput,
    })
  }

  /**
   * Find many normalizationConfigs based on the given query parameters
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<NormalizationConfig[]>} A promise containing the normalizationConfigs
   */
  async findMany(
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
      select?: Select
    } = {}
  ): Promise<NormalizationConfig[]> {
    const { skip, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    return this.prisma.normalizationConfig.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  /**
   * Find many normalizationConfigs and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<[NormalizationConfig[], number]>} A promise containing the normalizationConfigs and the total count of the results
   */
  async findAndCountMany(
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
      select?: Select
    } = {}
  ): Promise<[NormalizationConfig[], number]> {
    const { skip, select, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    const commonArgs = {
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([
      this.prisma.normalizationConfig.findMany({ ...commonArgs, take, skip, select }), // Find the normalizationConfigs
      this.prisma.normalizationConfig.count(commonArgs), // Count the total number of results
    ])
  }

  /**
   * CREATE
   */

  /**
   * Create a new normalizationConfig
   *
   * @param {CreateInput} createInput The data to create the normalizationConfig with
   * @returns {Promise<NormalizationConfig>} A promise containing the created normalizationConfig
   * @throws {HttpException} HttpException with status code 409 if the normalizationConfig already exists
   */
  async create(createInput: CreateInput): Promise<NormalizationConfig> {
    return this.prisma.normalizationConfig.create({
      data: {
        ...createInput,
        createdBy: '3422b448-2460-4fd2-9183-8000de6f8343',
        updatedBy: '3422b448-2460-4fd2-9183-8000de6f8343',
      },
    })
  }

  /**
   * UPDATE
   */

  /**
   * Update a normalizationConfig
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @param {UpdateInput} data The data to update the normalizationConfig with
   * @returns {Promise<NormalizationConfig>} A promise containing the updated normalizationConfig
   */
  async update(where: WhereUniqueInput, data: UpdateInput): Promise<NormalizationConfig> {
    return this.prisma.normalizationConfig.update({
      data, // The data to update the normalizationConfig with
      where, // A WHERE clause for the query
    })
  }

  /**
   * REMOVE
   */

  /**
   * Remove a normalizationConfig
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @returns {Promise<NormalizationConfig>} A promise containing the removed normalizationConfig
   */
  async remove(where: WhereUniqueInput): Promise<NormalizationConfig> {
    return this.prisma.normalizationConfig.delete({
      where, // A WHERE clause for the query
    })
  }
}
