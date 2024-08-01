import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Prisma, type TargetTable as PrismaTargetTable } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import PrismaService from '../../shared/prisma/service'
import { type CreateTargetTable, type UpdateTargetTable } from './dto'

export type WhereUniqueInput = Prisma.TargetTableWhereUniqueInput
export type WhereInput = Prisma.TargetTableWhereInput
export type OrderByWithRelationInput = Prisma.TargetTableOrderByWithRelationInput
export type Select = Prisma.TargetTableSelect

const TAKE = 100
const ORDER_BY: OrderByWithRelationInput = { updatedAt: 'desc' }

@Injectable()
export default class TargetTableService {
  constructor(private prisma: PrismaService) {}

  /**
   * ------------ GET FIRST ------------
   *
   * Get the first targetTable that matches the given `whereUniqueInput`.
   * If no targetTable is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaTargetTable>} The found targetTable
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no targetTable is found
   */
  async getFirst(whereUniqInput: WhereUniqueInput): Promise<PrismaTargetTable> {
    return this.prisma.targetTable
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
   * Get the unique targetTable that matches the given `whereUniqueInput`.
   * If no targetTable is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaTargetTable>} The found targetTable
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no targetTable is found
   */
  async getUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaTargetTable> {
    return this.prisma.targetTable
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
   * Find the first targetTable that matches the given `whereInput`
   *
   * @param {Object} params - The parameters for the query
   * @param {WhereInput} params.where - A WHERE clause for the query
   * @param {Select} params.select - A SELECT clause for the query
   * @returns {Promise<PrismaTargetTable | null>} - The found targetTable or `null` if no targetTable is found
   */
  async findFirst(
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<PrismaTargetTable | null> {
    return this.prisma.targetTable.findFirst(params)
  }

  /**
   * ------------ FIND UNIQUE ------------
   *
   * Find the unique targetTable that matches the given `whereUniqueInput`.
   * If no targetTable is found, return `null`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaTargetTable | null>} The found targetTable or `null` if no targetTable is found
   */
  async findUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaTargetTable | null> {
    return this.prisma.targetTable.findUnique({
      where: whereUniqInput,
    })
  }

  /**
   * ------------ FIND MANY ------------
   *
   * Find many targetTables based on the given query parameters
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<PrismaTargetTable[]>} A promise containing the targetTables
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
  ): Promise<PrismaTargetTable[]> {
    const { skip, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    return this.prisma.targetTable.findMany({
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
   * Find many targetTables and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<[PrismaTargetTable[], number]>} A promise containing the targetTables and the total count of the results
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
  ): Promise<[PrismaTargetTable[], number]> {
    const { skip, select, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    const commonArgs = {
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([
      this.prisma.targetTable.findMany({ ...commonArgs, take, skip, select }),
      this.prisma.targetTable.count(commonArgs),
    ])
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new targetTable
   *
   * @param {CreateInput} createInput The data to create the targetTable with
   * @returns {Promise<PrismaTargetTable>} A promise containing the created targetTable
   * @throws {HttpException} HttpException with status code 409 if the targetTable already exists
   */
  async create(createInput: CreateTargetTable): Promise<PrismaTargetTable> {
    const item = await this.prisma.targetTable.findUnique({ where: { kn: createInput.kn } })

    if (item) {
      throw new HttpException(`TargetTable with kn "${createInput.kn}" already exists`, HttpStatus.CONFLICT)
    }

    return this.prisma.targetTable.create({
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
   * Update a targetTable
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @param {UpdateInput} data The data to update the targetTable with
   * @returns {Promise<PrismaTargetTable>} A promise containing the updated targetTable
   */
  async update(where: WhereUniqueInput, data: UpdateTargetTable): Promise<PrismaTargetTable> {
    return this.prisma.targetTable.update({ where, data })
  }

  /**
   * ------------ REMOVE ------------
   *
   * Remove a targetTable
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @returns {Promise<PrismaTargetTable>} A promise containing the removed targetTable
   */
  async remove(where: WhereUniqueInput): Promise<PrismaTargetTable> {
    return this.prisma.targetTable.delete({
      where,
    })
  }
}
