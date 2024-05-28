import { Module } from '@nestjs/common'

import { MinioService } from 'src/minio.service'

import { PrismaService } from '../prisma.service'
import { Controller } from './normalization-configs.controller'
import { Service } from './normalization-configs.service'

@Module({
  controllers: [Controller],
  providers: [Service, PrismaService, MinioService],
})
export class NormalizationConfigModule {}
