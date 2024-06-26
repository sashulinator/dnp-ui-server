import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Prisma, type StoreConfig as PrismaStoreConfig } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import PrismaService from '../../prisma/prisma.service'
import { type CreateStoreConfig, type UpdateStoreConfig } from './store-configs.dto'

export type WhereUniqueInput = Prisma.StoreConfigWhereUniqueInput
export type WhereInput = Prisma.StoreConfigWhereInput
export type OrderByWithRelationInput = Prisma.StoreConfigOrderByWithRelationInput
export type Select = Prisma.StoreConfigSelect

const TAKE = 100
const ORDER_BY: OrderByWithRelationInput = { updatedAt: 'desc' }

@Injectable()
export class Service {
  constructor(private prisma: PrismaService) {}

  /**
   * ------------ GET FIRST ------------
   *
   * Get the first storeConfig that matches the given `whereUniqueInput`.
   * If no storeConfig is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaStoreConfig>} The found storeConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no storeConfig is found
   */
  async getFirst(whereUniqInput: WhereUniqueInput): Promise<PrismaStoreConfig> {
    return this.prisma.storeConfig
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
   * Get the unique storeConfig that matches the given `whereUniqueInput`.
   * If no storeConfig is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaStoreConfig>} The found storeConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no storeConfig is found
   */
  async getUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaStoreConfig> {
    return this.prisma.storeConfig
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
   * Find the first storeConfig that matches the given `whereInput`
   *
   * @param {Object} params - The parameters for the query
   * @param {WhereInput} params.where - A WHERE clause for the query
   * @param {Select} params.select - A SELECT clause for the query
   * @returns {Promise<PrismaStoreConfig | null>} - The found storeConfig or `null` if no storeConfig is found
   */
  async findFirst(
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<PrismaStoreConfig | null> {
    return this.prisma.storeConfig.findFirst(params)
  }

  /**
   * ------------ FIND UNIQUE ------------
   *
   * Find the unique storeConfig that matches the given `whereUniqueInput`.
   * If no storeConfig is found, return `null`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaStoreConfig | null>} The found storeConfig or `null` if no storeConfig is found
   */
  async findUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaStoreConfig | null> {
    return this.prisma.storeConfig.findUnique({
      where: whereUniqInput,
    })
  }

  /**
   * ------------ FIND MANY ------------
   *
   * Find many storeConfigs based on the given query parameters
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<PrismaStoreConfig[]>} A promise containing the storeConfigs
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
  ): Promise<PrismaStoreConfig[]> {
    const { skip, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    return this.prisma.storeConfig.findMany({
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
   * Find many storeConfigs and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<[PrismaStoreConfig[], number]>} A promise containing the storeConfigs and the total count of the results
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
  ): Promise<[PrismaStoreConfig[], number]> {
    const { skip, select, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    const commonArgs = {
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([
      this.prisma.storeConfig.findMany({ ...commonArgs, take, skip, select }),
      this.prisma.storeConfig.count(commonArgs),
    ])
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new storeConfig
   *
   * @param {CreateInput} createInput The data to create the storeConfig with
   * @returns {Promise<PrismaStoreConfig>} A promise containing the created storeConfig
   * @throws {HttpException} HttpException with status code 409 if the storeConfig already exists
   */
  async create(createInput: CreateStoreConfig): Promise<PrismaStoreConfig> {
    const item = await this.prisma.storeConfig.findUnique({ where: { keyName: createInput.keyName } })

    if (item) {
      throw new HttpException(`StoreConfig with keyName "${createInput.keyName}" already exists`, HttpStatus.CONFLICT)
    }

    return this.prisma.storeConfig.create({
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
   * Update a storeConfig
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @param {UpdateInput} data The data to update the storeConfig with
   * @returns {Promise<PrismaStoreConfig>} A promise containing the updated storeConfig
   */
  async update(where: WhereUniqueInput, data: UpdateStoreConfig): Promise<PrismaStoreConfig> {
    return this.prisma.storeConfig.update({ where, data })
  }

  /**
   * ------------ REMOVE ------------
   *
   * Remove a storeConfig
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @returns {Promise<PrismaStoreConfig>} A promise containing the removed storeConfig
   */
  async remove(where: WhereUniqueInput): Promise<PrismaStoreConfig> {
    return this.prisma.storeConfig.delete({
      where,
    })
  }
}
