import { Module } from '@nestjs/common'

import { PrismaModule } from '~/slices/prisma'

import { ProcessController } from './nest.controller'
import { ProcessService } from './nest.service'

@Module({
  controllers: [ProcessController],
  providers: [ProcessService],
  imports: [PrismaModule],
  exports: [ProcessService],
})
export class ProcessModule {}
