import { Injectable, StreamableFile } from '@nestjs/common'

import MinioService from '~/slices/minio/service'

@Injectable()
export default class Service {
  constructor(protected minio: MinioService) {}

  async create(file: Express.Multer.File, fileName: string) {
    return await this.minio.putObject('dnp-datastore', fileName, file.buffer)
  }

  async getUnique(id: string) {
    const stream = await this.minio.getObject('dnp-datastore', id)

    return new StreamableFile(stream)
  }

  async delete(id: string) {
    return await this.minio.removeObject('dnp-datastore', id)
  }
}
