import { Module } from '@nestjs/common'

import PrismaService from '../../shared/prisma/service'
import Controller from './controller'
import Service from './service'

@Module({
  controllers: [Controller],
  providers: [Service, PrismaService],
})
export default class EntityModule {}
