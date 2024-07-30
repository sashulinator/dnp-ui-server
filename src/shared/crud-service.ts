import type { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { isInstanceOf } from '~/utils/core'
import PrismaService from './prisma/service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { type DMMF } from '@prisma/client/runtime/library'
import { type EntityMap } from '~/lib/prisma'

const TAKE = 100
const ORDER_BY = { createdAt: 'desc' }

@Injectable()
export abstract class CrudService<T extends keyof EntityMap> {
  constructor(
    protected readonly prisma: PrismaService,
    // TODO: должно быть T но тогда ошибка в типах функций
    protected readonly name: T
  ) {}

  /**
   * ------------ GET FIRST------------
   *
   * Get the first instance that matches the given `whereUniqueInput`.
   * If no instance is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {Parameters<PrismaClient[T]['findFirstOrThrow']>} args
   * @returns {Promise<Entity>} The found process
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no process is found
   */
  async getFirst(...args: Parameters<PrismaClient[T]['findFirstOrThrow']>): Promise<EntityMap[T]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.prisma[this.name] as any).findFirstOrThrow(...args).catch((error) => {
      if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    })
  }

  /**
   * ------------ GET UNIQUE ------------
   *
   * Get the unique instance that matches the given `whereUniqueInput`.
   * If no instance is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {Parameters<PrismaClient[T]['findUniqueOrThrow']>} args
   * @returns {Promise<Entity>} The found normalizationConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no normalizationConfig is found
   */
  async getUnique(...args: Parameters<PrismaClient[T]['findUniqueOrThrow']>): Promise<EntityMap[T]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.prisma[this.name] as any).findUniqueOrThrow(...args).catch((error) => {
      if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    })
  }

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first instance that matches the given `whereInput`
   *
   * @param {Parameters<PrismaClient[T]['findFirst']>} args
   * @returns {Promise<Entity | null>} - The found process or `null` if no process is found
   */
  async findFirst(...args: Parameters<PrismaClient[T]['findFirst']>): Promise<EntityMap[T] | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.prisma[this.name] as any).findFirst(...args)
  }

  /**
   * ------------ FIND UNIQUE ------------
   *
   * Find the unique instance that matches the given `whereUniqueInput`.
   * If no instance is found, return `null`.
   *
   * @param {Parameters<PrismaClient[T]['findUnique']>} args
   * @returns {Promise<Entity | null>} The found process or `null` if no process is found
   */
  async findUnique(...args: Parameters<PrismaClient[T]['findUnique']>): Promise<EntityMap[T] | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.prisma[this.name] as any).findUnique(...args)
  }

  /**
   * ------------ FIND MANY ------------
   *
   * Find many entities based on the given query parameters
   *
   * @param {Parameters<PrismaClient[T]['findMany']>} args
   * @returns {Promise<Entity[]>} A promise containing the processes
   */
  async findMany(...args: Parameters<PrismaClient[T]['findMany']>): Promise<EntityMap[T][]> {
    const { skip, take = TAKE, cursor, where, orderBy = ORDER_BY } = args[0]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.prisma[this.name] as any).findMany({
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
   * Find many entities and return the total count of the results
   *
   * @param {Parameters<PrismaClient[T]['findMany']>} args
   * @returns {Promise<[Process[], number]>} A promise containing the processes and the total count of the results
   */
  async findAndCountMany(...args: Parameters<PrismaClient[T]['findMany']>): Promise<[EntityMap[T][], number]> {
    const { skip, select, take = TAKE, cursor, where, orderBy = ORDER_BY } = args[0]

    const commonArgs = {
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.prisma[this.name] as any).findMany({
        ...commonArgs,
        take,
        skip,
        ...this.getIncludeAllOtherwiseSelect(select),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.prisma[this.name] as any).count(commonArgs),
    ])
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new instance
   *
   * @param {Parameters<PrismaClient[T]['create']>} args
   * @returns {Promise<PrismaNormalizationConfig>} A promise containing the created normalizationConfig
   * @throws {HttpException} HttpException with status code 409 if the normalizationConfig already exists
   */
  async create(...args: Parameters<PrismaClient[T]['create']>): Promise<EntityMap[T]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.prisma[this.name] as any).create(...args)
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update instance
   *
   * @param {Parameters<PrismaClient[T]['update']>} args
   * @returns {Promise<PrismaNormalizationConfig>} A promise containing the updated normalizationConfig
   */
  async update(...args: Parameters<PrismaClient[T]['update']>): Promise<EntityMap[T]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.prisma[this.name] as any).update(...args)
  }

  /**
   * Returns the select object with all included fields if no select provided,
   * otherwise returns the select object provided.
   *
   * @param {Prisma.TypeMap['model'][Capitalize<T>]['operations']['findMany']['args']['select']} select -
   * Optional select object to be used in the query.
   * @returns {Object} - The select object to be used in the query.
   */
  private getIncludeAllOtherwiseSelect(
    select: Prisma.TypeMap['model'][Capitalize<T>]['operations']['findMany']['args']['select']
  ) {
    if (select) {
      return { select }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = (this.prisma as any)._runtimeDataModel.models[this.name] as DMMF.Model

    const includeAll = model.fields.reduce((acc, item) => {
      if (item?.relationName) {
        // If the field is a relation, add it to the accumulator object
        acc[item?.name] = true
      }
      return acc
    }, {})

    return { include: includeAll }
  }
}
