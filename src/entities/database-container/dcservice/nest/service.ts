import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/slices/prisma'

import { _Crud } from './_crud'

export type * from './_crud'

@Injectable()
export class DcserviceService extends _Crud {
  constructor(protected prisma: PrismaService) {
    super(prisma)
  }
}
