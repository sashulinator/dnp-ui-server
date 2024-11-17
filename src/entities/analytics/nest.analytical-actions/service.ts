import { Injectable } from '@nestjs/common'
import type { AnalyticalActions } from '@prisma/client'

import { PrismaService } from '~/slices/prisma'

export { type AnalyticalActions }

export type FindManyParams = Parameters<PrismaService['analyticalActions']['findMany']>[0]

@Injectable()
export class AnalyticalActionsService {
  constructor(protected prisma: PrismaService) {}

  /** @final */
  findMany(params?: FindManyParams): Promise<AnalyticalActions[]> {
    return this.prisma.analyticalActions.findMany(params)
  }
}
