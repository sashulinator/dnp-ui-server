import { Injectable } from '@nestjs/common'
import type { Prisma, Store as StorePrisma } from '@prisma/client'

import { CrudDelegator } from '~/slices/crud'
import { PrismaService } from '~/slices/prisma'

export type Store = StorePrisma
export type CreateStore = Prisma.StoreUncheckedCreateInput
export type UpdateStore = Prisma.StoreUncheckedUpdateInput

@Injectable()
export default class Service extends CrudDelegator<Store, CreateStore, UpdateStore> {
  constructor(protected prisma: PrismaService) {
    super(
      {},
      {
        count: CrudDelegator.notAllowed,
        create: CrudDelegator.notAllowed,
        delete: CrudDelegator.notAllowed,
        update: prisma.store.update.bind(prisma),
        getFirst: CrudDelegator.notAllowed,
        getUnique: prisma.store.findUniqueOrThrow.bind(prisma),
        findFirst: CrudDelegator.notAllowed,
        findMany: CrudDelegator.notAllowed,
        findUnique: CrudDelegator.notAllowed,
        transaction: CrudDelegator.notAllowed,
      },
    )
  }
}
