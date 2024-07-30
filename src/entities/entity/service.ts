import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Prisma, type Entity as PrismaEntity } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import PrismaService from '../../shared/prisma/service'
import { type CreateEntity, type UpdateEntity } from './dto'

export type WhereUniqueInput = Prisma.EntityWhereUniqueInput
export type WhereInput = Prisma.EntityWhereInput
export type OrderByWithRelationInput = Prisma.EntityOrderByWithRelationInput
export type Select = Prisma.EntitySelect

const TAKE = 100
const ORDER_BY: OrderByWithRelationInput = { updatedAt: 'desc' }

@Injectable()
export default class EntityService {
  constructor(private prisma: PrismaService) {}

  /**
   * ------------ GET FIRST ------------
   *
   * Get the first entity that matches the given `whereUniqueInput`.
   * If no entity is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaEntity>} The found entity
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no entity is found
   */
  async getFirst(whereUniqInput: WhereUniqueInput): Promise<PrismaEntity> {
    return this.prisma.entity
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
   * Get the unique entity that matches the given `whereUniqueInput`.
   * If no entity is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaEntity>} The found entity
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no entity is found
   */
  async getUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaEntity> {
    return this.prisma.entity
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
   * Find the first entity that matches the given `whereInput`
   *
   * @param {Object} params - The parameters for the query
   * @param {WhereInput} params.where - A WHERE clause for the query
   * @param {Select} params.select - A SELECT clause for the query
   * @returns {Promise<PrismaEntity | null>} - The found entity or `null` if no entity is found
   */
  async findFirst(
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<PrismaEntity | null> {
    return this.prisma.entity.findFirst(params)
  }

  /**
   * ------------ FIND UNIQUE ------------
   *
   * Find the unique entity that matches the given `whereUniqueInput`.
   * If no entity is found, return `null`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaEntity | null>} The found entity or `null` if no entity is found
   */
  async findUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaEntity | null> {
    return this.prisma.entity.findUnique({
      where: whereUniqInput,
    })
  }

  /**
   * ------------ FIND MANY ------------
   *
   * Find many entitys based on the given query parameters
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<PrismaEntity[]>} A promise containing the entitys
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
  ): Promise<PrismaEntity[]> {
    const { skip, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    return this.prisma.entity.findMany({
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
   * Find many entitys and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<[PrismaEntity[], number]>} A promise containing the entitys and the total count of the results
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
  ): Promise<[PrismaEntity[], number]> {
    const { skip, select, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    const commonArgs = {
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([
      this.prisma.entity.findMany({ ...commonArgs, take, skip, select }),
      this.prisma.entity.count(commonArgs),
    ])
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new entity
   *
   * @param {CreateInput} createInput The data to create the entity with
   * @returns {Promise<PrismaEntity>} A promise containing the created entity
   * @throws {HttpException} HttpException with status code 409 if the entity already exists
   */
  async create(createInput: CreateEntity): Promise<PrismaEntity> {
    const item = await this.prisma.entity.findUnique({ where: { kn: createInput.kn } })

    if (item) {
      throw new HttpException(`Entity with kn "${createInput.kn}" already exists`, HttpStatus.CONFLICT)
    }

    return this.prisma.entity.create({
      data: {
        ...createInput,
        createdById: 'tz4a98xxat96iws9zmbrgj3a',
        updatedById: 'tz4a98xxat96iws9zmbrgj3a',
      },
    })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update a entity
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @param {UpdateInput} data The data to update the entity with
   * @returns {Promise<PrismaEntity>} A promise containing the updated entity
   */
  async update(where: WhereUniqueInput, data: UpdateEntity): Promise<PrismaEntity> {
    return this.prisma.entity.update({ where, data })
  }

  /**
   * ------------ REMOVE ------------
   *
   * Remove a entity
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @returns {Promise<PrismaEntity>} A promise containing the removed entity
   */
  async remove(where: WhereUniqueInput): Promise<PrismaEntity> {
    return this.prisma.entity.delete({
      where,
    })
  }
}
