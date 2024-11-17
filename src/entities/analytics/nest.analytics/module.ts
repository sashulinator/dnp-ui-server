import { Module } from '@nestjs/common'

import { PrismaModule } from '~/slices/prisma'

import { AnalyticsController } from './controller'
import { AnalyticsService } from './service'

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [PrismaModule],
})
export class AnalyticsModule {}
