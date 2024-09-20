import { Injectable } from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'

import ExplorerService, {
  type CreateParams,
  type DeleteParams,
  type FindManyParams,
  type StringFilter,
  type UpdateParams,
  type Where,
} from '~/shared/explorer/service'
import MinioService from '~/shared/minio/service'

import ProcessService from '../processes/service'
import { assertTableSchema } from './assertions'
import { createImportOperationalTableNormalizationConfig } from './lib/create-import-operationtal-table-norm-config'
import Service from './service'

export type ExplorerFindManyParams = FindManyParams & {
  kn: string
  searchQuery: StringFilter
}
export type ExplorerCreateParams = { kn: string; input: Record<string, unknown> }
export type ExplorerDeleteParams = { kn: string; where: Where }
export type ExplorerUpdateParams = { kn: string; input: { _id: string } & Record<string, string> }
export type ExplorerImportParams = { fileId: string; tableName: string }

@Injectable()
export default class OperationalTableService {
  constructor(
    private explorerService: ExplorerService,
    private operationalTableService: Service,
    protected processService: ProcessService,
    protected minio: MinioService,
  ) {}

  async explorerFindManyAndCountRows(params: ExplorerFindManyParams) {
    const operationalTable = await this.operationalTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.operationalTableService.getStoreConfig()

    assertTableSchema(operationalTable.tableSchema)

    const searchOR = params.searchQuery
      ? operationalTable.tableSchema.items.reduce<Record<string, StringFilter>[]>((acc, item) => {
          if (item.index) acc.push({ [item.columnName]: params.searchQuery })
          return acc
        }, [])
      : []

    const findManyParams: Required<FindManyParams> = {
      take: params.take || 100,
      skip: params.skip || 0,
      sort: params.sort,
      where: { AND: [{ OR: searchOR }, params.where] },
      type: 'postgres',
      paths: [storeConfig.data.dbName, operationalTable.tableName],
      storeConfig: {
        host: storeConfig.data.host,
        port: storeConfig.data.port,
        username: storeConfig.data.username,
        password: storeConfig.data.password,
      },
    }

    const explorer = await this.explorerService.findManyAndCountRows(findManyParams)

    return {
      explorer,
      operationalTable,
    }
  }

  async explorerDelete(params: ExplorerDeleteParams) {
    const operationalTable = await this.operationalTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.operationalTableService.getStoreConfig()

    const deleteParams: Required<DeleteParams> = {
      where: params.where,
      type: 'postgres',
      paths: [storeConfig.data.dbName, operationalTable.tableName],
      storeConfig: {
        host: storeConfig.data.host,
        port: storeConfig.data.port,
        username: storeConfig.data.username,
        password: storeConfig.data.password,
      },
    }

    const row = await this.explorerService.deleteRow(deleteParams)

    return {
      row,
      operationalTable,
    }
  }

  async explorerCreate(params: ExplorerCreateParams) {
    const operationalTable = await this.operationalTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.operationalTableService.getStoreConfig()

    const createParams: Required<CreateParams> = {
      input: params.input,
      type: 'postgres',
      paths: [storeConfig.data.dbName, operationalTable.tableName],
      storeConfig: {
        host: storeConfig.data.host,
        port: storeConfig.data.port,
        username: storeConfig.data.username,
        password: storeConfig.data.password,
      },
    }

    const row = await this.explorerService.createRow(createParams)

    return {
      row,
      operationalTable,
    }
  }

  async explorerUpdate(params: ExplorerUpdateParams) {
    const operationalTable = await this.operationalTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.operationalTableService.getStoreConfig()

    const updateParams: Required<UpdateParams> = {
      input: params.input,
      where: { _id: params.input._id },
      type: 'postgres',
      paths: [storeConfig.data.dbName, operationalTable.tableName],
      storeConfig: {
        host: storeConfig.data.host,
        port: storeConfig.data.port,
        username: storeConfig.data.username,
        password: storeConfig.data.password,
      },
    }

    const row = await this.explorerService.updateRow(updateParams)

    return {
      row,
      operationalTable,
    }
  }

  async explorerImport(params: ExplorerImportParams) {
    const fileNameSplitted = params.fileId.split('.')

    const fileExt = fileNameSplitted[fileNameSplitted.length - 1]

    // Prepare the filename and buffer for uploading to Minio
    const configFileName = `${'operational-table-import-' + createId()}.json`
    const buffer = JSON.stringify(
      createImportOperationalTableNormalizationConfig(params.fileId, fileExt, params.tableName),
    )

    // Upload the normalizationConfig to Minio
    await this.minio.putObject('import-runtime-configs', configFileName, buffer)

    // Set the headers for the HTTP request
    const headers = new Headers()
    headers.set('Authorization', 'Basic ' + Buffer.from('airflow:airflow').toString('base64'))
    headers.set('Content-Type', 'application/json;charset=UTF-8')

    await fetch('http://10.4.40.30:8080/api/v1/dags/dnp_rest_api_trigger/dagRuns', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        conf: {
          dnp_s3_config_path: `import-runtime-configs/${configFileName}`,
        },
      }),
    })

    return this.processService.createWithRuntimeConfig({
      data: {
        id: createId(),
        type: 'import',
        data: buffer,
      },
    })
  }
}
