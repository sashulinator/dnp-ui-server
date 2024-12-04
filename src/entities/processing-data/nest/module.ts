import { Module } from '@nestjs/common'

import { PrismaModule } from '~/slices/prisma'

import { ProcessingDataService } from './service'

@Module({
  providers: [ProcessingDataService],
  imports: [PrismaModule],
})
export class ProcessingDataModule {}
