import { Module } from '@nestjs/common'

import { EngineModule } from '~/slices/engine'
import { PrismaModule } from '~/slices/prisma'

import { AnalyticsController } from './controller'
import { AnalyticsService } from './service'

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [PrismaModule, EngineModule],
})
export class AnalyticsModule {}
