import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/slices/prisma'

import { _CrudService } from './service._crud'

export type * from './service._crud'

@Injectable()
export class StoreService extends _CrudService {
  constructor(protected prisma: PrismaService) {
    super(prisma)
  }
}
