import { Injectable } from '@nestjs/common'
import { type Prisma, type Store } from '@prisma/client'

import { PrismaService } from '~/slices/prisma'

export { type Store }
export type FindUniqueOrThrowParams = Parameters<PrismaService['store']['findUniqueOrThrow']>[0]
export type CreateParams = Parameters<PrismaService['store']['create']>[0]
export type CreateManyParams = Parameters<PrismaService['store']['createMany']>[0]
export type UpdateParams = Parameters<PrismaService['store']['update']>[0]
export type UniqueInput = Prisma.StoreWhereUniqueInput

@Injectable()
export default class StoreService {
  constructor(private prisma: PrismaService) {}

  /** @final */
  async findUniqueOrThrow(params: FindUniqueOrThrowParams): Promise<Store> {
    return this.prisma.store.findUniqueOrThrow(params)
  }

  /** @final */
  async createMany(params: CreateManyParams): Promise<{ count: number }> {
    return this.prisma.store.createMany(params)
  }

  /** @final */
  async create(params: CreateParams): Promise<Store> {
    return this.prisma.store.create(params)
  }

  /** @final */
  async update(params: UpdateParams): Promise<Store> {
    return this.prisma.store.update(params)
  }
}
