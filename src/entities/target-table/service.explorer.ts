import { Injectable } from '@nestjs/common'

import ExplorerService, {
  type CreateParams,
  type DeleteParams,
  type FindManyParams,
  type StringFilter,
  type UpdateParams,
  type Where,
} from '~/shared/explorer/service'

import { assertColumns } from './assertions'
import Service from './service'

export type ExplorerFindManyParams = FindManyParams & {
  kn: string
  searchQuery: StringFilter
}
export type ExplorerCreateParams = { kn: string; input: Record<string, unknown> }
export type ExplorerDeleteParams = { kn: string; where: Where }
export type ExplorerUpdateParams = { kn: string; input: { _id: string } & Record<string, string> }

@Injectable()
export default class TargetTableService {
  constructor(
    private explorerService: ExplorerService,
    private targetTableService: Service,
  ) {}

  async explorerFindManyAndCountRows(params: ExplorerFindManyParams) {
    const targetTable = await this.targetTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.targetTableService.getStoreConfig()

    assertColumns(targetTable.items)

    const searchOR = params.searchQuery
      ? targetTable.items.reduce<Record<string, StringFilter>[]>((acc, item) => {
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
      paths: [storeConfig.data.dbName, targetTable.tableName],
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
      targetTable,
    }
  }

  async explorerDelete(params: ExplorerDeleteParams) {
    const targetTable = await this.targetTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.targetTableService.getStoreConfig()

    const deleteParams: Required<DeleteParams> = {
      where: params.where,
      type: 'postgres',
      paths: [storeConfig.data.dbName, targetTable.tableName],
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
      targetTable,
    }
  }

  async explorerCreate(params: ExplorerCreateParams) {
    const targetTable = await this.targetTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.targetTableService.getStoreConfig()

    const createParams: Required<CreateParams> = {
      input: params.input,
      type: 'postgres',
      paths: [storeConfig.data.dbName, targetTable.tableName],
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
      targetTable,
    }
  }

  async explorerUpdate(params: ExplorerUpdateParams) {
    const targetTable = await this.targetTableService.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.targetTableService.getStoreConfig()

    const updateParams: Required<UpdateParams> = {
      input: params.input,
      where: { _id: params.input._id },
      type: 'postgres',
      paths: [storeConfig.data.dbName, targetTable.tableName],
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
      targetTable,
    }
  }
}
