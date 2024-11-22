import { Injectable } from '@nestjs/common'
import type { Prisma, Store as StorePrisma } from '@prisma/client'

import { PrismaService } from '~/slices/prisma'

export type Store = StorePrisma
export type CreateStore = Prisma.StoreUncheckedCreateInput
export type UpdateStore = Prisma.StoreUncheckedUpdateInput

@Injectable()
export default class StoreService {
  constructor(private prisma: PrismaService) {}

  /** @final */
  async getUnique(name: string): Promise<Store> {
    return this.prisma.store.findUniqueOrThrow({ where: { name } })
  }

  async create(data: CreateStore): Promise<Store> {
    return this.prisma.store.create({ data })
  }

  async update(data: UpdateStore): Promise<Store> {
    if (!data.name || typeof data.name !== 'string') throw new Error('name is required')
    return this.prisma.store.update({ where: { name: data.name }, data })
  }
}
