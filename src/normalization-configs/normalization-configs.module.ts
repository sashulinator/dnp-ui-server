import { Module } from '@nestjs/common'

import { Controller } from './normalization-configs.controller'
import { Service } from './normalization-configs.service'
import PrismaModule from '~/prisma/prisma.module'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [PrismaModule],
})
export class NormalizationConfigModule {}
