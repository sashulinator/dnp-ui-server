import { Injectable } from '@nestjs/common'
import MinioService from '~/shared/minio/service'

@Injectable()
export default class Service {
  constructor(protected minio: MinioService) {}

  async create(file: Express.Multer.File, fileName: string) {
    return await this.minio.putObject('dnp-datastore', fileName, file.buffer)
  }

  async getUnique(id: string) {
    return await this.minio.getObject('dnp-datastore', id)
  }

  async delete(id: string) {
    return await this.minio.removeObject('dnp-datastore', id)
  }
}
