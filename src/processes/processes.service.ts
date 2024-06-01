import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Prisma, type Process } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import { PrismaService } from '../prisma.service'
import { type CreateProcess, type UpdateProcess } from './processes.dto'

export type WhereUniqueInput = Prisma.ProcessWhereUniqueInput
export type WhereInput = Prisma.ProcessWhereInput
export type OrderByWithRelationInput = Prisma.ProcessOrderByWithRelationInput
export type Select = Prisma.ProcessSelect

const TAKE = 100
const ORDER_BY: OrderByWithRelationInput = { createdAt: 'desc' }

@Injectable()
export class Service {
  constructor(private prisma: PrismaService) {}

  /**
   * ------------ GET FIRST------------
   *
   * Get the first process that matches the given `whereUniqueInput`.
   * If no process is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<Process>} The found process
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no process is found
   */
  async getFirst(whereUniqInput: WhereUniqueInput): Promise<Process> {
    return this.prisma.process
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
   * Get the unique process that matches the given `whereUniqueInput`.
   * If no process is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<Process>} The found process
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no process is found
   */
  async getUnique(whereUniqInput: WhereUniqueInput): Promise<Process> {
    return this.prisma.process
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
   * Find the first process that matches the given `whereInput`
   *
   * @param {Object} params - The parameters for the query
   * @param {WhereInput} params.where - A WHERE clause for the query
   * @param {Select} params.select - A SELECT clause for the query
   * @returns {Promise<Process | null>} - The found process or `null` if no process is found
   */
  async findFirst(
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<Process | null> {
    return this.prisma.process.findFirst(params)
  }

  /**
   * ------------ FIND UNIQUE ------------
   *
   * Find the unique process that matches the given `whereUniqueInput`.
   * If no process is found, return `null`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<Process | null>} The found process or `null` if no process is found
   */
  async findUnique(whereUniqInput: WhereUniqueInput): Promise<Process | null> {
    return this.prisma.process.findUnique({
      where: whereUniqInput,
    })
  }

  /**
   * ------------ FIND MANY ------------
   *
   * Find many processes based on the given query parameters
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<Process[]>} A promise containing the processes
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
  ): Promise<Process[]> {
    const { skip, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    return this.prisma.process.findMany({
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
   * Find many processes and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<[Process[], number]>} A promise containing the processes and the total count of the results
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
  ): Promise<[Process[], number]> {
    const { skip, select, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    const commonArgs = {
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([
      this.prisma.process.findMany({ ...commonArgs, take, skip, select }),
      this.prisma.process.count(commonArgs),
    ])
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new process
   *
   * @param {CreateInput} createInput The data to create the process with
   * @returns {Promise<Process>} A promise containing the created process
   * @throws {HttpException} HttpException with status code 409 if the process already exists
   */
  async create(createInput: CreateProcess): Promise<Process> {
    return this.prisma.process.create({
      data: {
        ...createInput,
        createdBy: '3422b448-2460-4fd2-9183-8000de6f8343',
      },
    })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update a process
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @param {UpdateInput} data The data to update the process with
   * @returns {Promise<Process>} A promise containing the updated process
   */
  async update(where: WhereUniqueInput, data: UpdateProcess): Promise<Process> {
    return this.prisma.process.update({
      data,
      where,
    })
  }

  /**
   * ------------ REMOVE ------------
   *
   * Remove a process
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @returns {Promise<Process>} A promise containing the removed process
   */
  async remove(where: WhereUniqueInput): Promise<Process> {
    return this.prisma.process.delete({
      where,
    })
  }
}
