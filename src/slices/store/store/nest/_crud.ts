import { type Prisma, type Store } from '@prisma/client'

import { PrismaService } from '~/slices/prisma'

export { type Store }

const NAME = 'store'
type Name = typeof NAME
type Entity = Store

export type FindUniqueOrThrowParams = Parameters<PrismaService[Name]['findUniqueOrThrow']>[0]
export type CreateParams = Parameters<PrismaService[Name]['create']>[0]
export type CreateManyParams = Parameters<PrismaService[Name]['createMany']>[0]
export type UpdateParams = Parameters<PrismaService[Name]['update']>[0]
export type UniqueInput = Prisma.StoreWhereUniqueInput

export class _Crud {
  constructor(protected prisma: PrismaService) {}

  /** @final */
  async findUniqueOrThrow(params: FindUniqueOrThrowParams): Promise<Entity> {
    return this.prisma[NAME].findUniqueOrThrow(params)
  }

  /** @final */
  async createMany(params: CreateManyParams): Promise<{ count: number }> {
    return this.prisma[NAME].createMany(params)
  }

  /** @final */
  async create(params: CreateParams): Promise<Entity> {
    return this.prisma[NAME].create(params)
  }

  /** @final */
  async update(params: UpdateParams): Promise<Entity> {
    return this.prisma[NAME].update(params)
  }
}
