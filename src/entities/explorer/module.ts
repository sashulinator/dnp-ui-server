import { Module } from '@nestjs/common'

import { Controller } from './controller'
import { Service } from './service'
import StoreConfigModule from '../store-configs/module'
import PrismaModule from '../../shared/prisma/module'

@Module({
  controllers: [Controller],
  providers: [Service],
  imports: [PrismaModule, StoreConfigModule],
})
export default class EntityModule {}
