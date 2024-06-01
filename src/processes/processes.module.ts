import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { Controller } from './processes.controller'
import { Service } from './processes.service'

@Module({
  controllers: [Controller],
  providers: [Service, PrismaService],
})
export class NormalizationConfigModule {}
