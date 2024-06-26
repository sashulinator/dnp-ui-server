import { Module } from '@nestjs/common'

import { MinioService } from 'src/minio.service'

import { Controller } from './normalization-configs-archive.controller'
import { Service } from './normalization-configs-archive.service'
import PrismaModule from '~/prisma/prisma.module'

@Module({
  controllers: [Controller],
  providers: [Service, MinioService],
  imports: [PrismaModule],
})
export class NormalizationConfigArchiveModule {}
