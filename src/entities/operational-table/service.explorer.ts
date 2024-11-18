import { Injectable } from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'

import { ConfigBuilder, EngineService } from '~/slices/engine'
import ExplorerService, {
  type CreateParams,
  type DeleteParams,
  type FindManyParams,
  type StringFilter,
  type UpdateParams,
  type Where,
} from '~/slices/explorer/service'
import { ProcessService } from '~/slices/process'
import { generateId, random } from '~/utils/core'

import { assertColumn } from './assertions'
import Service from './service'

export type ExplorerFindManyParams = FindManyParams & {
  kn: string
  searchQuery: StringFilter
}
export type ExplorerCreateParams = { kn: string; input: Record<string, unknown> }
export type ExplorerDeleteParams = { kn: string; where: Where }
export type ExplorerUpdateParams = { kn: string; input: { _id: string } & Record<string, string> }
export type ExplorerFileToTableParams = { operationalTableId: string; fileNames: string[]; bucketName: string }

@Injectable()
export default class OperationalTableService {
  constructor(
    private explorerService: ExplorerService,
    private operationalTableService: Service,
    protected processService: ProcessService,
    protected engineService: EngineService,
  ) {}

  async explorerFindManyAndCountRows(params: ExplorerFindManyParams) {
    const operationalTable = await this.operationalTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.operationalTableService.getStoreConfig()

    assertColumn(operationalTable.columns)

    const searchOR = params.searchQuery
      ? operationalTable.columns.reduce<Record<string, StringFilter>[]>((acc, item) => {
          if (item.index || item.primary) acc.push({ [item.name]: params.searchQuery })
          return acc
        }, [])
      : []

    const findManyParams: Required<FindManyParams> = {
      take: params.take || 100,
      skip: params.skip || 0,
      sort: params.sort,
      where: { AND: [{ OR: searchOR }, params.where] },
      type: 'postgres',
      paths: [storeConfig.data.dbName, operationalTable.name],
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
      paths: [storeConfig.data.dbName, operationalTable.name],
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
      paths: [storeConfig.data.dbName, operationalTable.name],
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
      paths: [storeConfig.data.dbName, operationalTable.name],
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

  async explorerImportFromFile(params: ExplorerFileToTableParams) {
    const TYPE = 'import'
    const trackingId = random(0, 999999999)
    const databaseConfig = await this.operationalTableService.getStoreConfig()
    const operationaTable = await this.operationalTableService.findFirst({ where: { kn: params.operationalTableId } })

    const promises = params.fileNames.map(async (fileName) => {
      const fileNameSplitted = fileName.split('.')

      const fileExt = fileNameSplitted.at(-1)

      const JDBC_NAME = 'jdbc_base'
      const S3_NAME = 's3_base'

      const normalizationConfig = new ConfigBuilder()
        .setTrackId(trackingId)
        .addConnection(JDBC_NAME, {
          client: 'postgresql',
          host: databaseConfig.data.host,
          port: Number(databaseConfig.data.port),
          database: databaseConfig.data.dbName,
          username: databaseConfig.data.username,
          password: databaseConfig.data.password,
          schema: 'public',
          truncate: true,
        })
        .addOut('dnp_data', { table: operationaTable.name, extends: JDBC_NAME })
        .addConnection(S3_NAME, {
          format: fileExt === 'csv' ? 'csv' : 'excel',
          path: `/`,
          bucket: params.bucketName,
          options: {
            header: true,
            delimiter: ';',
          },
        })
        .addIn('dnp_data', {
          fileName: fileName,
          extends: S3_NAME,
        })
        .addExecutable({
          indentity: {
            id: 'DnpDataPostprocessing',
          },
          'computable-config': {
            'computable-name': 'dnp-common/artifacts/procedures/DnpDataPostprocessing',
            version: '0.0.1',
          },
          'sdk-config': {
            'sdk-name': 'risk-engine-corp-sdk',
            version: '1.1.2',
          },
        })
        .addUniversalService('ru.datatech.sdk.service.dataframe.DFactory')
        .addUniversalService('ru.datatech.sdk.service.configtables.ConfigTablesFactory')
        .addUniversalService('ru.datatech.sdk.service.procedure.ProcedureConfigFactory')
        .build()

      const normalizationConfigFileNameParams = [['fileName', fileName]]
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

      const normalizationConfigFileName = `${normalizationConfigFileNameParams}-${generateId()}.json`

      await this.engineService.runNormalization({
        configFileName: normalizationConfigFileName,
        config: normalizationConfig,
        type: 'import',
      })

      return this.processService.create({
        data: {
          id: createId(),
          type: TYPE,
          trackId: params.operationalTableId,
          data: {
            trackingId,
            normalizationConfigFileName,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            normalizationConfig: normalizationConfig as any,
            tableId: params.operationalTableId,
          },
        },
      })
    })

    return Promise.all(promises)
  }
}
