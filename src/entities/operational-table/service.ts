import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Prisma, type OperationalTable as PrismaOperationalTable } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import PrismaService from '../../shared/prisma/service'
import { type CreateOperationalTable, type UpdateOperationalTable } from './dto'

export type WhereUniqueInput = Prisma.OperationalTableWhereUniqueInput
export type WhereInput = Prisma.OperationalTableWhereInput
export type OrderByWithRelationInput = Prisma.OperationalTableOrderByWithRelationInput
export type Select = Prisma.OperationalTableSelect

const TAKE = 100
const ORDER_BY: OrderByWithRelationInput = { updatedAt: 'desc' }

@Injectable()
export default class OperationalTableService {
  constructor(private prisma: PrismaService) {}

  /**
   * ------------ GET FIRST ------------
   *
   * Get the first operationalTable that matches the given `whereUniqueInput`.
   * If no operationalTable is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaOperationalTable>} The found operationalTable
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no operationalTable is found
   */
  async getFirst(whereUniqInput: WhereUniqueInput): Promise<PrismaOperationalTable> {
    return this.prisma.operationalTable
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
   * Get the unique operationalTable that matches the given `whereUniqueInput`.
   * If no operationalTable is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaOperationalTable>} The found operationalTable
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no operationalTable is found
   */
  async getUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaOperationalTable> {
    return this.prisma.operationalTable
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
   * Find the first operationalTable that matches the given `whereInput`
   *
   * @param {Object} params - The parameters for the query
   * @param {WhereInput} params.where - A WHERE clause for the query
   * @param {Select} params.select - A SELECT clause for the query
   * @returns {Promise<PrismaOperationalTable | null>} - The found operationalTable or `null` if no operationalTable is found
   */
  async findFirst(
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<PrismaOperationalTable | null> {
    return this.prisma.operationalTable.findFirst(params)
  }

  /**
   * ------------ FIND UNIQUE ------------
   *
   * Find the unique operationalTable that matches the given `whereUniqueInput`.
   * If no operationalTable is found, return `null`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaOperationalTable | null>} The found operationalTable or `null` if no operationalTable is found
   */
  async findUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaOperationalTable | null> {
    return this.prisma.operationalTable.findUnique({
      where: whereUniqInput,
    })
  }

  /**
   * ------------ FIND MANY ------------
   *
   * Find many operationalTables based on the given query parameters
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<PrismaOperationalTable[]>} A promise containing the operationalTables
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
  ): Promise<PrismaOperationalTable[]> {
    const { skip, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    return this.prisma.operationalTable.findMany({
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
   * Find many operationalTables and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<[PrismaOperationalTable[], number]>} A promise containing the operationalTables and the total count of the results
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
  ): Promise<[PrismaOperationalTable[], number]> {
    const { skip, select, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    const commonArgs = {
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([
      this.prisma.operationalTable.findMany({ ...commonArgs, take, skip, select }),
      this.prisma.operationalTable.count(commonArgs),
    ])
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new operationalTable
   *
   * @param {CreateInput} createInput The data to create the operationalTable with
   * @returns {Promise<PrismaOperationalTable>} A promise containing the created operationalTable
   * @throws {HttpException} HttpException with status code 409 if the operationalTable already exists
   */
  async create(createInput: CreateOperationalTable): Promise<PrismaOperationalTable> {
    const item = await this.prisma.operationalTable.findUnique({ where: { kn: createInput.kn } })

    if (item) {
      throw new HttpException(`OperationalTable with kn "${createInput.kn}" already exists`, HttpStatus.CONFLICT)
    }

    return this.prisma.operationalTable.create({
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
   * Update a operationalTable
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @param {UpdateInput} data The data to update the operationalTable with
   * @returns {Promise<PrismaOperationalTable>} A promise containing the updated operationalTable
   */
  async update(where: WhereUniqueInput, data: UpdateOperationalTable): Promise<PrismaOperationalTable> {
    return this.prisma.operationalTable.update({ where, data })
  }

  /**
   * ------------ REMOVE ------------
   *
   * Remove a operationalTable
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @returns {Promise<PrismaOperationalTable>} A promise containing the removed operationalTable
   */
  async remove(where: WhereUniqueInput): Promise<PrismaOperationalTable> {
    return this.prisma.operationalTable.delete({
      where,
    })
  }
}
