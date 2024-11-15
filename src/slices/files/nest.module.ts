import { Module } from '@nestjs/common'

import MinioModule from '~/slices/minio/module'

import { FileController } from './nest.controller'
import { FileService } from './nest.service'

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [MinioModule],
})
export class FileModule {}
