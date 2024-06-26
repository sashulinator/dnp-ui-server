import { Module } from '@nestjs/common'

import { MinioService } from 'src/minio.service'

import { Controller } from './processes.controller'
import { Service } from './processes.service'
import PrismaModule from '~/prisma/prisma.module'

@Module({
  controllers: [Controller],
  providers: [Service, MinioService],
  imports: [PrismaModule],
})
export class ProcessModule {}
