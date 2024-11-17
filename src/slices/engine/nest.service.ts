import { Injectable } from '@nestjs/common'

import MinioService from '~/slices/minio/service'

import { type ResponseData, runDag } from './api/run-dag'
import type { EngineConfig } from './models'

export type NormalizeResult = ResponseData
export type NormalizeParams = {
  fileName: string
  bucketName: string
  normalizationConfig: Record<string, unknown>
}

export type AnalyticsResult = ResponseData
export type AnalyticsParams = {
  fileName: string
  bucketName: string
  analyticsConfig: EngineConfig
}

@Injectable()
export default class Service {
  constructor(protected minioService: MinioService) {}
  async runNormalization(params: NormalizeParams): Promise<NormalizeResult> {
    const buffer = JSON.stringify(params.normalizationConfig)

    await this.minioService.putObject(params.bucketName, params.fileName, buffer)

    // Trigger the Airflow DAG run
    const ret = await runDag({
      name: 'dnp_rest_api_trigger',
      s3ConfigPath: `${params.bucketName}/${params.fileName}`,
    })

    return ret.data
  }

  async runAnalytics(params: AnalyticsParams): Promise<AnalyticsResult> {
    const buffer = JSON.stringify(params.analyticsConfig)

    await this.minioService.putObject(params.bucketName, params.fileName, buffer)

    // Trigger the Airflow DAG run
    const ret = await runDag({
      name: 'dnp_rest_api_trigger',
      s3ConfigPath: `${params.bucketName}/${params.fileName}`,
    })

    return ret.data
  }
}
