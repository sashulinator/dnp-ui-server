import { Module } from '@nestjs/common'

import { MinioService } from 'src/minio.service'

import { PrismaService } from '../prisma.service'
import { Controller } from './processes.controller'
import { Service } from './processes.service'

@Module({
  controllers: [Controller],
  providers: [Service, PrismaService, MinioService],
})
export class ProcessModule {}
