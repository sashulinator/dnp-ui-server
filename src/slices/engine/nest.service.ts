import { Injectable } from '@nestjs/common'

import MinioService from '~/slices/minio/service'

import { type ResponseData, runDag } from './api/run-dag'

export type NormalizeResult = ResponseData

export type RunNormalizeParams = {
  configFileName: string
  type: string
  config: Record<string, unknown>
}

const BUCKET = 'ui-server'

@Injectable()
export default class Service {
  constructor(protected minioService: MinioService) {}
  async runNormalization(params: RunNormalizeParams): Promise<NormalizeResult> {
    const buffer = JSON.stringify(params.config)

    await this.minioService.putObject(BUCKET, `${params.type}/${params.configFileName}`, buffer)

    // Trigger the Airflow DAG run
    const ret = await runDag({
      name: 'dnp_rest_api_trigger_v2',
      s3ConfigPath: `${BUCKET}/${params.type}/${params.configFileName}`,
    })

    return ret.data
  }
}
