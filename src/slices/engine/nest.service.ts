import { Injectable } from '@nestjs/common'

import MinioService from '~/slices/minio/service'
import { generateId, isString } from '~/utils/core'

import { type ResponseData, runDag } from './api/run-dag'

export type NormalizeResult = ResponseData
export type NormalizeParams = {
  fileName: string | [string, string][]
  data: Record<string, unknown>
}

const S3_BUCKET = 'dnp-common'

@Injectable()
export default class Service {
  constructor(protected minioService: MinioService) {}
  async normalize(params: NormalizeParams): Promise<NormalizeResult> {
    const buffer = JSON.stringify(params.data)

    const paramFileName = isString(params.fileName)
      ? params.fileName
      : params.fileName.map(([key, value]) => `${key}=${value}`).join('&')

    const fileName = `${paramFileName}&fileId=${generateId(5)}.json`

    await this.minioService.putObject(S3_BUCKET, fileName, buffer)

    // Trigger the Airflow DAG run
    const ret = await runDag({ s3ConfigPath: `${S3_BUCKET}/${fileName}` })

    return ret.data
  }
}
