import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { Controller } from './normalization-configs.controller'
import { Service } from './normalization-configs.service'

@Module({
  controllers: [Controller],
  providers: [Service, PrismaService],
})
export class NormalizationConfigModule {}
