import { Module } from '@nestjs/common'

import { PrismaModule } from '~/slices/prisma'

import { StoreController } from './controller'
import { StoreService } from './service'

@Module({
  controllers: [StoreController],
  providers: [StoreService],
  imports: [PrismaModule],
})
export class StoreModule {}
