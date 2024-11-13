import { Injectable } from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'

import { EngineService } from '~/slices/engine'
import ExplorerService, {
  type CreateParams,
  type DeleteParams,
  type FindManyParams,
  type StringFilter,
  type UpdateParams,
  type Where,
} from '~/slices/explorer/service'
import { generateId, random } from '~/utils/core'

import ProcessService from '../processes/service'
import { assertColumn } from './assertions'
import { createImportOperationalTableNormalizationConfig } from './lib/create-import-operationtal-table-norm-config'
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

  async explorerFileToTable(params: ExplorerFileToTableParams) {
    const TYPE = 'import'
    const trackingId = random(0, 999999999)
    const databaseConfig = await this.operationalTableService.getStoreConfig()
    const operationaTable = await this.operationalTableService.findFirst({ where: { kn: params.operationalTableId } })

    const promises = params.fileNames.map(async (fileName) => {
      const fileNameSplitted = fileName.split('.')

      const fileExt = fileNameSplitted.at(-1)

      const normalizationConfig = createImportOperationalTableNormalizationConfig({
        sourceFileName: fileName,
        fileExtension: fileExt,
        destinationTable: operationaTable.name,
        trackingId,
        bucketName: params.bucketName,
        databaseConfig: {
          username: databaseConfig.data.username,
          password: databaseConfig.data.password,
          database: databaseConfig.data.dbName,
          host: databaseConfig.data.host,
          port: Number(databaseConfig.data.port),
        },
      })

      const normalizationConfigFileNameParams = [
        ['type', TYPE],
        ['name', fileName],
      ]
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

      const normalizationConfigFileName = `${normalizationConfigFileNameParams}-${generateId()}.json`

      await this.engineService.normalize({
        fileName: normalizationConfigFileName,
        bucketName: params.bucketName,
        normalizationConfig: normalizationConfig,
      })

      return this.processService.create({
        data: {
          id: createId(),
          type: TYPE,
          initiatorId: params.operationalTableId,
          data: {
            trackingId,
            normalizationConfigFileName,
            normalizationConfig,
            tableId: params.operationalTableId,
          },
        },
      })
    })

    return Promise.all(promises)
  }
}
