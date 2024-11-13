import { Injectable } from '@nestjs/common'

import MinioService from '~/slices/minio/service'

import { type ResponseData, runDag } from './api/run-dag'

export type NormalizeResult = ResponseData
export type NormalizeParams = {
  fileName: string
  bucketName: string
  normalizationConfig: Record<string, unknown>
}

@Injectable()
export default class Service {
  constructor(protected minioService: MinioService) {}
  async normalize(params: NormalizeParams): Promise<NormalizeResult> {
    const buffer = JSON.stringify(params.normalizationConfig)

    await this.minioService.putObject(params.bucketName, params.fileName, buffer)

    // Trigger the Airflow DAG run
    const ret = await runDag({ s3ConfigPath: `${params.bucketName}/${params.fileName}` })

    return ret.data
  }
}
