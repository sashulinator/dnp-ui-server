import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/slices/prisma'

import { _Crud } from './service._crud'

export type * from './service._crud'

@Injectable()
export class QueryFilterService extends _Crud {
  constructor(protected prisma: PrismaService) {
    super(prisma)
  }
}
