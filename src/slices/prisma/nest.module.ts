import { Module } from '@nestjs/common'

import { PrismaService } from './nest.service'

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
