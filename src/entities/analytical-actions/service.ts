import { Injectable } from '@nestjs/common'
import type { AnalyticalActions as AnalyticalActionsPrisma } from '@prisma/client'

import { CrudDelegator } from '~/slices/crud'

import PrismaService from '../../slices/prisma/service'

export type AnalyticalActions = AnalyticalActionsPrisma

@Injectable()
export default class Service extends CrudDelegator<AnalyticalActions, never, never> {
  constructor(protected prisma: PrismaService) {
    super(
      {},
      {
        count: CrudDelegator.notAllowed,
        create: CrudDelegator.notAllowed,
        delete: CrudDelegator.notAllowed,
        update: CrudDelegator.notAllowed,
        getFirst: CrudDelegator.notAllowed,
        getUnique: CrudDelegator.notAllowed,
        findFirst: CrudDelegator.notAllowed,
        findMany: prisma.analyticalActions.findMany.bind(prisma),
        findUnique: CrudDelegator.notAllowed,
        transaction: CrudDelegator.notAllowed,
      },
    )
  }
}
