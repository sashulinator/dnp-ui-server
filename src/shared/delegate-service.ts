import { Injectable } from '@nestjs/common'
import { type Prisma } from '@prisma/client'
import PrismaService from './prisma/service'

export interface Delegate {
  aggregate(data: unknown): Prisma.PrismaPromise<unknown>
  count(data: unknown): Prisma.PrismaPromise<unknown>
  create(data: unknown): Prisma.PrismaPromise<unknown>
  delete(data: unknown): Prisma.PrismaPromise<unknown>
  deleteMany(data: unknown): Prisma.PrismaPromise<unknown>
  findFirst(data: unknown): Prisma.PrismaPromise<unknown>
  findUnique(data: unknown): Prisma.PrismaPromise<unknown>
  findFirstOrThrow(data: unknown): Prisma.PrismaPromise<unknown>
  findUniqueOrThrow(data: unknown): Prisma.PrismaPromise<unknown>
  update(data: unknown): Prisma.PrismaPromise<unknown>
  updateMany(data: unknown): Prisma.PrismaPromise<unknown>
  upsert(data: unknown): Prisma.PrismaPromise<unknown>
  findMany(
    data: Record<string, unknown> & { skip: number; take: number; select: unknown }
  ): Prisma.PrismaPromise<unknown>
}

const TAKE = 100

@Injectable()
export abstract class DelegateService<D extends Delegate> {
  constructor(
    protected prisma: PrismaService,
    protected delegate: D
  ) {}

  public getDelegate(): D {
    return this.delegate
  }

  public async aggregate(data: unknown) {
    const result = await this.delegate.aggregate(data)
    return result
  }

  public async count(data: unknown) {
    const result = await this.delegate.count(data)
    return result
  }

  public async create(data: unknown) {
    const result = await this.delegate.create(data)
    return result
  }

  public async delete(data: unknown) {
    const result = await this.delegate.delete(data)
    return result
  }

  public async deleteMany(data: unknown) {
    const result = await this.delegate.deleteMany(data)
    return result
  }

  public async findFirst(data: unknown) {
    const result = await this.delegate.findFirst(data)
    return result
  }

  // 🟢 Почему-то требует указать тип возвращаемого значения
  public findFirstOrThrow(data: unknown): ReturnType<D['findFirstOrThrow']> {
    const result = this.delegate.findFirstOrThrow(data)
    return result as ReturnType<D['findFirstOrThrow']>
  }

  public async findUnique(data: unknown) {
    const result = await this.delegate.findUnique(data)
    return result
  }

  // 🟢 Почему-то требует указать тип возвращаемого значения
  public findUniqueOrThrow(data: unknown): ReturnType<D['findUniqueOrThrow']> {
    const result = this.delegate.findUniqueOrThrow(data)
    return result as ReturnType<D['findUniqueOrThrow']>
  }

  public async update(data: unknown) {
    const result = await this.delegate.update(data)
    return result
  }

  public async updateMany(data: unknown) {
    const result = await this.delegate.update(data)
    return result
  }

  public async upsert(data: unknown) {
    const result = await this.delegate.upsert(data)
    return result
  }

  /**
   * ------------ FIND MANY ------------
   *
   * Find many entities based on the given query parameters
   *
   * @param {Parameters<PrismaClient[T]['findMany']>} args
   * @returns {Promise<Entity[]>} A promise containing the processes
   */
  findMany(...args: Parameters<D['findMany']>): ReturnType<D['findMany']> {
    const { take = TAKE, ...restProps } = args[0]

    return this.delegate.findMany({
      take,
      ...restProps,
    }) as ReturnType<D['findMany']>
  }

  /**
   * ------------ FIND AND COUNT MANY ------------
   *
   * Find many entities and return the total count of the results
   *
   * @param {Parameters<PrismaClient[T]['findMany']>} args
   * @returns {Promise<[Process[], number]>} A promise containing the processes and the total count of the results
   */
  async findAndCountMany(...args: Parameters<D['findMany']>): Promise<[ReturnType<D['findMany']>, number]> {
    const { skip, select, take = TAKE, cursor, where, orderBy } = args[0]

    const commonArgs = {
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([
      this.delegate.findMany({
        ...commonArgs,
        select,
        take,
        skip,
      }),
      this.delegate.count(commonArgs),
    ]) as Promise<[ReturnType<D['findMany']>, number]>
  }
}
