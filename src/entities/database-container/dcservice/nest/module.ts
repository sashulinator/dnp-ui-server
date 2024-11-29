import { Module } from '@nestjs/common'

import { PrismaModule } from '~/slices/prisma'

import { DcserviceController } from './controller'
import { DcserviceService } from './service'

@Module({
  controllers: [DcserviceController],
  providers: [DcserviceService],
  imports: [PrismaModule],
})
export class DcserviceModule {}
