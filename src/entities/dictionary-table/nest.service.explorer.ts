import { Injectable } from '@nestjs/common'

import Database from '~/slices/database'
import ExplorerService, {
  type CreateParams,
  type DeleteParams,
  type FindManyParams,
  type StringFilter,
  type UpdateParams,
  type Where,
} from '~/slices/explorer/service'

import { ProcessingDataService, TARGET_STORE } from '../processing-data'
import { assertColumns } from './lib.assertions'
import Service from './nest.service'

export type ExplorerFindManyParams = FindManyParams & {
  kn: string
  searchQuery: StringFilter
}
export type ExplorerCreateParams = { kn: string; input: Record<string, unknown> }
export type ExplorerDeleteParams = { kn: string; where: Where }
export type ExplorerUpdateParams = { kn: string; input: Record<string | number, string>; where: Where }

@Injectable()
export default class DictionaryTableService {
  constructor(
    private explorerService: ExplorerService,
    private dictionaryTableService: Service,
    private database: Database,
    private processingDataService: ProcessingDataService,
  ) {}

  async explorerFindManyAndCountRows(params: ExplorerFindManyParams) {
    const dictionaryTable = await this.dictionaryTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.processingDataService.getDatabaseConfig({ name: TARGET_STORE })

    const columns = dictionaryTable.columns
    assertColumns(columns)

    const searchOR = params.searchQuery
      ? columns.reduce<Record<string, StringFilter>[]>((acc, item) => {
          if (item.index || item.primary) acc.push({ [item.name]: params.searchQuery })
          return acc
        }, [])
      : []

    this.database.setConfig({
      client: 'postgres',
      host: storeConfig.host,
      port: storeConfig.port,
      username: storeConfig.username,
      password: storeConfig.password,
      dbName: storeConfig.database,
    })

    const pk = await this.database.getPrimaryKey(dictionaryTable.name)

    this.database.disconnect()

    const findManyParams: Required<FindManyParams> = {
      take: params.take || 100,
      skip: params.skip || 0,
      sort: params.sort || { [pk]: 'asc' },
      where: { AND: [{ OR: searchOR }, params.where] },
      type: 'postgres',
      paths: [storeConfig.database, dictionaryTable.name],
      storeConfig: {
        host: storeConfig.host,
        port: storeConfig.port.toString(),
        username: storeConfig.username,
        password: storeConfig.password,
      },
    }

    const explorer = await this.explorerService.findManyAndCountRows(findManyParams)

    return {
      explorer,
      dictionaryTable,
    }
  }

  async explorerDelete(params: ExplorerDeleteParams) {
    const dictionaryTable = await this.dictionaryTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.dictionaryTableService.getStoreConfig()

    const deleteParams: Required<DeleteParams> = {
      where: params.where,
      type: 'postgres',
      paths: [storeConfig.data.dbName, dictionaryTable.name],
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
      dictionaryTable,
    }
  }

  async explorerCreate(params: ExplorerCreateParams) {
    const dictionaryTable = await this.dictionaryTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.dictionaryTableService.getStoreConfig()

    const createParams: Required<CreateParams> = {
      input: params.input,
      type: 'postgres',
      paths: [storeConfig.data.dbName, dictionaryTable.name],
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
      dictionaryTable,
    }
  }

  async explorerUpdate(params: ExplorerUpdateParams) {
    const dictionaryTable = await this.dictionaryTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.dictionaryTableService.getStoreConfig()

    const updateParams: Required<UpdateParams> = {
      input: params.input,
      where: params.where,
      type: 'postgres',
      paths: [storeConfig.data.dbName, dictionaryTable.name],
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
      dictionaryTable,
    }
  }
}
