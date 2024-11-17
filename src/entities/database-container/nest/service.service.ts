import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/slices/prisma'

@Injectable()
export class ServiceService {
  constructor(protected prisma: PrismaService) {}
}
