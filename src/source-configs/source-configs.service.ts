import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Prisma, type SourceConfig as PrismaSourceConfig } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import { PrismaService } from '../prisma.service'
import { type CreateSourceConfig, type UpdateSourceConfig } from './source-configs.dto'

export type WhereUniqueInput = Prisma.SourceConfigWhereUniqueInput
export type WhereInput = Prisma.SourceConfigWhereInput
export type OrderByWithRelationInput = Prisma.SourceConfigOrderByWithRelationInput
export type Select = Prisma.SourceConfigSelect

const TAKE = 100
const ORDER_BY: OrderByWithRelationInput = { updatedAt: 'desc' }

@Injectable()
export class Service {
  constructor(private prisma: PrismaService) {}

  /**
   * ------------ GET FIRST ------------
   *
   * Get the first sourceConfig that matches the given `whereUniqueInput`.
   * If no sourceConfig is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaSourceConfig>} The found sourceConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no sourceConfig is found
   */
  async getFirst(whereUniqInput: WhereUniqueInput): Promise<PrismaSourceConfig> {
    return this.prisma.sourceConfig
      .findFirstOrThrow({
        where: whereUniqInput,
      })
      .catch((error) => {
        if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
        throw new HttpException('Not found', HttpStatus.NOT_FOUND)
      })
  }

  /**
   * ------------ GET UNIQUE ------------
   *
   * Get the unique sourceConfig that matches the given `whereUniqueInput`.
   * If no sourceConfig is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaSourceConfig>} The found sourceConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no sourceConfig is found
   */
  async getUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaSourceConfig> {
    return this.prisma.sourceConfig
      .findUniqueOrThrow({
        where: whereUniqInput,
      })
      .catch((error) => {
        if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
        throw new HttpException('Not found', HttpStatus.NOT_FOUND)
      })
  }

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first sourceConfig that matches the given `whereInput`
   *
   * @param {Object} params - The parameters for the query
   * @param {WhereInput} params.where - A WHERE clause for the query
   * @param {Select} params.select - A SELECT clause for the query
   * @returns {Promise<PrismaSourceConfig | null>} - The found sourceConfig or `null` if no sourceConfig is found
   */
  async findFirst(
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<PrismaSourceConfig | null> {
    return this.prisma.sourceConfig.findFirst(params)
  }

  /**
   * ------------ FIND UNIQUE ------------
   *
   * Find the unique sourceConfig that matches the given `whereUniqueInput`.
   * If no sourceConfig is found, return `null`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaSourceConfig | null>} The found sourceConfig or `null` if no sourceConfig is found
   */
  async findUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaSourceConfig | null> {
    return this.prisma.sourceConfig.findUnique({
      where: whereUniqInput,
    })
  }

  /**
   * ------------ FIND MANY ------------
   *
   * Find many sourceConfigs based on the given query parameters
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<PrismaSourceConfig[]>} A promise containing the sourceConfigs
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
  ): Promise<PrismaSourceConfig[]> {
    const { skip, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    return this.prisma.sourceConfig.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  /**
   * ------------ FIND AND COUNT MANY ------------
   *
   * Find many sourceConfigs and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<[PrismaSourceConfig[], number]>} A promise containing the sourceConfigs and the total count of the results
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
  ): Promise<[PrismaSourceConfig[], number]> {
    const { skip, select, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    const commonArgs = {
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([
      this.prisma.sourceConfig.findMany({ ...commonArgs, take, skip, select }),
      this.prisma.sourceConfig.count(commonArgs),
    ])
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new sourceConfig
   *
   * @param {CreateInput} createInput The data to create the sourceConfig with
   * @returns {Promise<PrismaSourceConfig>} A promise containing the created sourceConfig
   * @throws {HttpException} HttpException with status code 409 if the sourceConfig already exists
   */
  async create(createInput: CreateSourceConfig): Promise<PrismaSourceConfig> {
    const item = await this.prisma.sourceConfig.findUnique({ where: { keyName: createInput.keyName } })

    if (item) {
      throw new HttpException(`SourceConfig with keyName "${createInput.keyName}" already exists`, HttpStatus.CONFLICT)
    }

    return this.prisma.sourceConfig.create({
      data: {
        ...createInput,
        createdBy: 'tz4a98xxat96iws9zmbrgj3a',
        updatedBy: 'tz4a98xxat96iws9zmbrgj3a',
      },
    })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update a sourceConfig
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @param {UpdateInput} data The data to update the sourceConfig with
   * @returns {Promise<PrismaSourceConfig>} A promise containing the updated sourceConfig
   */
  async update(where: WhereUniqueInput, data: UpdateSourceConfig): Promise<PrismaSourceConfig> {
    return this.prisma.sourceConfig.update({ where, data })
  }

  /**
   * ------------ REMOVE ------------
   *
   * Remove a sourceConfig
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @returns {Promise<PrismaSourceConfig>} A promise containing the removed sourceConfig
   */
  async remove(where: WhereUniqueInput): Promise<PrismaSourceConfig> {
    return this.prisma.sourceConfig.delete({
      where,
    })
  }
}
