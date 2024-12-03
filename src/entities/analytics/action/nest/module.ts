import { Module } from '@nestjs/common'

import { PrismaModule } from '~/slices/prisma'

import { ActionController } from './controller'
import { ActionService } from './service'

@Module({
  controllers: [ActionController],
  providers: [ActionService],
  imports: [PrismaModule],
})
export class ActionsModule {}
