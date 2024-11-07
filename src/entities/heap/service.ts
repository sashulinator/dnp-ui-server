import { Injectable } from '@nestjs/common'
import type { Heap as HeapPrisma, Prisma } from '@prisma/client'

import { CrudDelegator } from '~/slices/crud'

import PrismaService from '../../slices/prisma/service'

export type Heap = HeapPrisma
export type CreateHeap = Prisma.HeapUncheckedCreateInput
export type UpdateHeap = Prisma.HeapUncheckedUpdateInput

@Injectable()
export default class Service extends CrudDelegator<Heap, CreateHeap, UpdateHeap> {
  constructor(protected prisma: PrismaService) {
    super(
      {},
      {
        count: CrudDelegator.notAllowed,
        create: CrudDelegator.notAllowed,
        delete: CrudDelegator.notAllowed,
        update: prisma.heap.update.bind(prisma),
        getFirst: CrudDelegator.notAllowed,
        getUnique: prisma.heap.findUniqueOrThrow.bind(prisma),
        findFirst: CrudDelegator.notAllowed,
        findMany: CrudDelegator.notAllowed,
        findUnique: CrudDelegator.notAllowed,
        transaction: CrudDelegator.notAllowed,
      },
    )
  }
}
