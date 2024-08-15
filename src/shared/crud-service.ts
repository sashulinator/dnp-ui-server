import { Prisma } from '@prisma/client'
import PrismaService from './prisma/service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { isInstanceOf } from '~/utils/core'

interface Delegate<TEntity, TCreateEntity> {
  getFirst: (params: {
    skip?: number
    take?: number
    cursor?: _AnyRecord
    where?: _AnyRecord
    orderBy?: _AnyRecord
    select?: _AnyRecord
    include?: _AnyRecord
  }) => Promise<TEntity>
  getUnique(params: { where: _AnyRecord; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity>
  count(params: { cursor?: _AnyRecord; where?: _AnyRecord }): Promise<number>
  findFirst(params: {
    skip?: number
    take?: number
    cursor?: _AnyRecord
    where?: _AnyRecord
    orderBy?: _AnyRecord
    select?: _AnyRecord
    include?: _AnyRecord
  }): Promise<TEntity | null>
  findMany(params: {
    skip?: number
    take?: number
    cursor?: _AnyRecord
    where?: _AnyRecord
    orderBy?: _AnyRecord
    select?: _AnyRecord
    include?: _AnyRecord
  }): Promise<TEntity[]>
  findUnique(params: { where: _AnyRecord; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity | null>
  create(params: { data: TCreateEntity; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity>
}

@Injectable()
export abstract class CrudService<TEntity, TCreateEntity> {
  constructor(
    protected prisma: PrismaService,
    public defaultParams: {
      take?: number
      orderBy?: Record<string, unknown>
      include?: Record<string, unknown>
    },
    public delegate: Delegate<TEntity, TCreateEntity>
  ) {}

  async count(params: { cursor?: _AnyRecord; where?: _AnyRecord }): Promise<number> {
    return this.delegate.count(params)
  }

  async create(params: { data: TCreateEntity; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity> {
    return this.delegate.create(params)
  }

  async getFirst(
    params: {
      skip?: number
      take?: number
      cursor?: Record<string, unknown>
      where?: Record<string, unknown>
      orderBy?: Record<string, unknown>
      select?: Record<string, unknown>
      include?: Record<string, unknown>
    } = {}
  ): Promise<TEntity> {
    return this.delegate.getFirst(this._prepareParams(params)).catch((error) => {
      if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    })
  }

  async getUnique(params: { where: _AnyRecord; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity> {
    return this.delegate.getUnique(this._prepareParams(params)).catch((error) => {
      if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    })
  }

  async findAndCountMany(
    params: {
      skip?: number
      take?: number
      cursor?: _AnyRecord
      where?: _AnyRecord
      orderBy?: _AnyRecord
      select?: _AnyRecord
    } = {}
  ): Promise<[TEntity[], number]> {
    const { skip, select, take = this.defaultParams.take, cursor, where } = params

    const commonArgs = {
      cursor,
      where,
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.prisma.$transaction([
      this.delegate.findMany(this._prepareParams({ ...commonArgs, take, skip, select })),
      this.delegate.count(commonArgs),
    ])
  }

  async findFirst(
    params: {
      skip?: number
      take?: number
      cursor?: _AnyRecord
      where?: _AnyRecord
      orderBy?: _AnyRecord
      select?: _AnyRecord
      include?: _AnyRecord
    } = {}
  ): Promise<TEntity | null> {
    return this.delegate.findFirst(this._prepareParams(params))
  }

  async findMany(
    params: {
      skip?: number
      take?: number
      cursor?: _AnyRecord
      where?: _AnyRecord
      orderBy?: _AnyRecord
      select?: _AnyRecord
    } = {}
  ): Promise<TEntity[]> {
    return this.delegate.findMany(this._prepareParams(params))
  }

  async findUnique(params: { where: _AnyRecord; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity> {
    return this.delegate.findUnique(this._prepareParams(params))
  }

  _prepareParams<
    T extends {
      take?: number
      orderBy?: Record<string, unknown>
      select?: Record<string, unknown>
      include?: Record<string, unknown>
    },
  >(params: T): T {
    const retParams = { ...params }

    if (!params.select) {
      retParams.include = retParams.include || this.defaultParams.include
    }

    retParams.orderBy = params.orderBy ?? this.defaultParams.orderBy
    retParams.take = params.take ?? this.defaultParams.take

    return retParams
  }
}

/**
 * Private
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _AnyRecord = Record<string, any>
