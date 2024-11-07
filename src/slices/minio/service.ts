import { Injectable } from '@nestjs/common'

import * as Minio from 'minio'

@Injectable()
export default class MinioService extends Minio.Client {
  constructor() {
    super({
      endPoint: '10.4.40.30',
      port: 8083,
      useSSL: false,
      accessKey: 'LzPBO0JiaPCY8q92',
      secretKey: 'HrcZv5ikO4Pg1ftPEmwYeItb3EzBGXO9',
    })
  }
}
