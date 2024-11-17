import { Module } from '@nestjs/common'

import { PrismaModule } from '~/slices/prisma'

import { AnaliticalActionsController } from './nest.controller'
import { AnaliticalActionsService } from './nest.service'

@Module({
  controllers: [AnaliticalActionsController],
  providers: [AnaliticalActionsService],
  imports: [PrismaModule],
})
export class AnalyticalActionsModule {}
