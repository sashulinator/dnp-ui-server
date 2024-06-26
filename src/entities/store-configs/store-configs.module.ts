import { Module } from '@nestjs/common'

import PrismaService from '../../prisma/prisma.service'
import { Controller } from './store-configs.controller'
import { Service } from './store-configs.service'

@Module({
  controllers: [Controller],
  providers: [Service, PrismaService],
})
export default class SourceModule {}
