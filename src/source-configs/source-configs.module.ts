import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { Controller } from './source-configs.controller'
import { Service } from './source-configs.service'

@Module({
  controllers: [Controller],
  providers: [Service, PrismaService],
})
export default class SourceModule {}
