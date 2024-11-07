import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

export interface Delegated<TEntity, TCreateEntity, TUpdateEntity> {
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
  create(params: { data: TCreateEntity; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity>
  delete(params: { where: _AnyRecord; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity>
  update(params: {
    data: TUpdateEntity
    where: _AnyRecord
    select?: _AnyRecord
    include?: _AnyRecord
  }): Promise<TEntity>
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
  transaction<T>(promises: Promise<unknown>[]): Promise<T>
}

@Injectable()
export abstract class Delegator<TEntity, TCreateEntity, TUpdateEntity> {
  constructor(
    public defaultParams: {
      take?: number
      orderBy?: Record<string, unknown>
      include?: Record<string, unknown>
    },
    private delegated: Delegated<TEntity, TCreateEntity, TUpdateEntity>,
  ) {}

  async count(params: { cursor?: _AnyRecord; where?: _AnyRecord }): Promise<number> {
    return this.delegated.count(params)
  }

  async create(params: { data: TCreateEntity; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity> {
    return this.delegated.create(this._prepareSelectIncludeParams(params))
  }

  async delete(params: { where: _AnyRecord; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity> {
    return this.delegated.delete(this._prepareSelectIncludeParams(params))
  }

  async update(params: {
    data: TUpdateEntity
    where: _AnyRecord
    select?: _AnyRecord
    include?: _AnyRecord
  }): Promise<TEntity> {
    return this.delegated.update(this._prepareSelectIncludeParams(params))
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
    } = {},
  ): Promise<TEntity> {
    return this.delegated.getFirst(this._prepareParams(params))
  }

  async getUnique(params: { where: _AnyRecord; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity> {
    return this.delegated.getUnique(this._prepareSelectIncludeParams(params))
  }

  async findAndCountMany(
    params: {
      skip?: number
      take?: number
      cursor?: _AnyRecord
      where?: _AnyRecord
      orderBy?: _AnyRecord
      select?: _AnyRecord
    } = {},
  ): Promise<[TEntity[], number]> {
    const { skip, select, take = this.defaultParams.take, cursor, where } = params

    const commonArgs = {
      cursor,
      where,
    }

    return this.delegated.transaction([
      this.delegated.findMany(this._prepareParams({ ...commonArgs, take, skip, select })),
      this.delegated.count(commonArgs),
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
    } = {},
  ): Promise<TEntity | null> {
    return this.delegated.findFirst(this._prepareParams(params))
  }

  async findMany(
    params: {
      skip?: number
      take?: number
      cursor?: _AnyRecord
      where?: _AnyRecord
      orderBy?: _AnyRecord
      select?: _AnyRecord
    } = {},
  ): Promise<TEntity[]> {
    return this.delegated.findMany(this._prepareParams(params))
  }

  async findUnique(params: { where: _AnyRecord; select?: _AnyRecord; include?: _AnyRecord }): Promise<TEntity> {
    return this.delegated.findUnique(this._prepareSelectIncludeParams(params))
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

    retParams.orderBy = params.orderBy ?? this.defaultParams.orderBy
    retParams.take = params.take ?? this.defaultParams.take

    return this._prepareSelectIncludeParams(retParams)
  }

  _prepareSelectIncludeParams<
    T extends {
      select?: Record<string, unknown>
      include?: Record<string, unknown>
    },
  >(params: T): T {
    const retParams = { ...params }

    if (!params.select) {
      retParams.include = retParams.include || this.defaultParams.include
    }

    return retParams
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static notAllowed(...args: any[]): any {
    // eslint-disable-next-line no-console
    console.error(args)
    throw new HttpException('Not allowed', HttpStatus.FORBIDDEN)
  }
}

/**
 * Private
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _AnyRecord = Record<string, any>
