import { Module } from '@nestjs/common'

import { PrismaModule } from '~/slices/prisma'

import { QueryFilterController } from './controller'
import { QueryFilterService } from './service'

@Module({
  controllers: [QueryFilterController],
  providers: [QueryFilterService],
  imports: [PrismaModule],
})
export class QueryFilterModule {}
