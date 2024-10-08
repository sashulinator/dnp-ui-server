import { Injectable } from '@nestjs/common'

import Database from '~/lib/database'
import ExplorerService, {
  type CreateParams,
  type DeleteParams,
  type FindManyParams,
  type StringFilter,
  type UpdateParams,
  type Where,
} from '~/shared/explorer/service'

import { assertTableSchema } from './assertions'
import Service from './service'

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
  ) {}

  async explorerFindManyAndCountRows(params: ExplorerFindManyParams) {
    const dictionaryTable = await this.dictionaryTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.dictionaryTableService.getStoreConfig()

    assertTableSchema(dictionaryTable.tableSchema)

    const searchOR = params.searchQuery
      ? dictionaryTable.tableSchema.items.reduce<Record<string, StringFilter>[]>((acc, item) => {
          if (item.index) acc.push({ [item.columnName]: params.searchQuery })
          return acc
        }, [])
      : []

    this.database.setConfig({
      client: 'postgres',
      host: storeConfig.data.host,
      port: storeConfig.data.port,
      username: storeConfig.data.username,
      password: storeConfig.data.password,
      dbName: storeConfig.data.dbName,
    })

    const pk = await this.database.getPrimaryKey(dictionaryTable.tableName)

    this.database.disconnect()

    const findManyParams: Required<FindManyParams> = {
      take: params.take || 100,
      skip: params.skip || 0,
      sort: params.sort || { [pk]: 'asc' },
      where: { AND: [{ OR: searchOR }, params.where] },
      type: 'postgres',
      paths: [storeConfig.data.dbName, dictionaryTable.tableName],
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
      dictionaryTable,
    }
  }

  async explorerDelete(params: ExplorerDeleteParams) {
    const dictionaryTable = await this.dictionaryTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.dictionaryTableService.getStoreConfig()

    const deleteParams: Required<DeleteParams> = {
      where: params.where,
      type: 'postgres',
      paths: [storeConfig.data.dbName, dictionaryTable.tableName],
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
      paths: [storeConfig.data.dbName, dictionaryTable.tableName],
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
      paths: [storeConfig.data.dbName, dictionaryTable.tableName],
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
