import { Module } from '@nestjs/common'

import { PrismaModule } from '~/slices/prisma'

import { AnalyticalActionsController } from './controller'
import { AnalyticalActionsService } from './service'

@Module({
  controllers: [AnalyticalActionsController],
  providers: [AnalyticalActionsService],
  imports: [PrismaModule],
})
export class AnalyticalActionsModule {}
