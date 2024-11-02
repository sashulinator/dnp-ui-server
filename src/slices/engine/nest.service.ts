import { Injectable } from '@nestjs/common'

import MinioService from '~/shared/minio/service'
import { generateId } from '~/utils/core'

import { type ResponseData, runDag } from './api/run-dag'

export type NormalizeResult = ResponseData
export type NormalizeParams = {
  name: string
  id: string
  data: Record<string, unknown>
}

const S3_BUCKET = 'dnp-common'

@Injectable()
export default class Service {
  constructor(protected minioService: MinioService) {}
  async normalize(normalizationConfig: NormalizeParams): Promise<NormalizeResult> {
    const buffer = JSON.stringify(normalizationConfig.data)

    const fileName = `type=normalization&name=${normalizationConfig.name}&id=${normalizationConfig.id}&fileId=${generateId(5)}.json`

    await this.minioService.putObject(S3_BUCKET, fileName, buffer)

    // Trigger the Airflow DAG run
    const ret = await runDag({ s3ConfigPath: `${S3_BUCKET}/${fileName}` })

    return ret.data
  }
}
