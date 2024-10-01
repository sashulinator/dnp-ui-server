import { Injectable } from '@nestjs/common'

import Database, { type StringFilter, type Where } from '~/lib/database'
import { has, isString } from '~/utils/core'

import type { Explorer, StoreConfig } from './dto'

export { Where, StringFilter }

export interface UpdateParams {
  paths: string[]
  type: 'postgres' | 's3'
  storeConfig: StoreConfig
  input: Record<string, unknown>
  where: Where
}

export interface DeleteParams {
  paths: string[]
  type: 'postgres' | 's3'
  storeConfig: StoreConfig
  where: Where
}

export interface CreateParams {
  paths: string[]
  type: 'postgres' | 's3'
  storeConfig: StoreConfig
  input: Record<string, unknown>
}

export interface FindManyParams {
  type: 'postgres' | 's3'
  paths: string[]
  take?: number | undefined
  skip?: number | undefined
  where?: Where | undefined
  sort?: Record<string, 'asc' | 'desc'> | undefined
  storeConfig: StoreConfig
}

@Injectable()
export default class ExplorerService {
  constructor(private database: Database) {}

  async findMany(params: FindManyParams): Promise<Explorer> {
    if (params.type === 's3') {
      throw new Error('Не имплементированно')
    }

    if (params.paths.length === 1) return this.findManyAndCountTables(params)
    return this.findManyAndCountRows(params)
  }

  async findManyAndCountTables(params: FindManyParams): Promise<Explorer> {
    const { storeConfig, paths, type, take = 100, skip = 0 } = params
    const [dbName] = paths

    this.database.setConfig({
      client: type,
      username: storeConfig.username,
      password: storeConfig.password,
      host: storeConfig.host,
      port: storeConfig.port,
      dbName,
    })

    const [tables, count] = await this.database.findManyAndCountTables({ limit: take, offset: skip })

    this.database.disconnect()

    return {
      paths: [{ name: dbName, type }],
      type,
      name: dbName,
      total: count,
      idKey: 'name',
      items: tables.map((table) => ({ type: 'table', data: { name: table.tablename } })),
    }
  }

  async findManyAndCountRows(params: FindManyParams): Promise<Explorer> {
    const { storeConfig, paths, type } = params
    const [dbName, tableName] = paths

    this.database.setConfig({
      client: type,
      username: storeConfig.username,
      password: storeConfig.password,
      host: storeConfig.host,
      port: storeConfig.port,
      dbName,
    })

    const [rows, count] = await this.database.findManyAndCountRows(tableName, {
      limit: params.take,
      offset: params.skip,
      where: params.where,
      sort: params.sort,
    })
    const pk = await this.database.getPrimaryKey(tableName)

    this.database.disconnect()

    return {
      paths: [
        { name: dbName, type: 'postgres' },
        { name: tableName, type: 'table' },
      ],
      name: tableName,
      type: 'table',
      total: count,
      idKey: pk,
      items: rows.map((row) => ({
        type: 'row',
        data: row,
      })),
    }
  }

  /**
   * ------------ CREATE ------------
   */

  create(params: CreateParams) {
    if (params.type === 'postgres') {
      if (params.paths.length === 0) {
        throw new Error('Нельзя создавать базу данных! Возможно вы забыли указать в path название таблицы')
      }
      if (params.paths.length === 1) {
        throw new Error('Создание таблицы не имплементированно!')
      }
      return this.createRow(params)
    }
  }

  createRow(params: CreateParams) {
    const { storeConfig, paths, input, type } = params
    const [dbName, tableName] = paths

    this.database.setConfig({
      client: type,
      username: storeConfig.username,
      password: storeConfig.password,
      host: storeConfig.host,
      port: storeConfig.port,
      dbName,
    })

    const ret = this.database.insertRow(tableName, input as Record<string, unknown>)

    this.database.disconnect()

    return ret
  }

  /**
   * ------------ UPDATE ------------
   */

  update(params: UpdateParams) {
    if (params.type === 'postgres') {
      if (params.paths.length === 0) {
        throw new Error('Нельзя вносить изменения в базу данных! Возможно вы забыли указать в path название таблицы')
      }
      if (params.paths.length === 1) {
        return this.updateTable(params)
      }
      if (params.paths.length === 2) {
        return this.updateRow(params)
      }
    }
  }

  updateTable(params: UpdateParams) {
    const { storeConfig, paths, input, type } = params
    const [dbName, tableName] = paths

    if (!has(input, 'name') || !isString(input.name)) throw Error('Невалидные данные для внесения изменений')

    this.database.setConfig({
      client: type,
      username: storeConfig.username,
      password: storeConfig.password,
      host: storeConfig.host,
      port: storeConfig.port,
      dbName,
    })

    const ret = this.database.renameTable(tableName, input.name)

    this.database.disconnect()

    return ret
  }

  updateRow(params: UpdateParams) {
    const { storeConfig, paths, type, input, where } = params
    const [dbName, tableName] = paths

    this.database.setConfig({
      client: type,
      username: storeConfig.username,
      password: storeConfig.password,
      host: storeConfig.host,
      port: storeConfig.port,
      dbName,
    })

    const ret = this.database.updateRow(tableName, input, where)

    this.database.disconnect()

    return ret
  }

  /**
   * ------------ DELETE ------------
   */

  deleteRow(params: DeleteParams) {
    const { storeConfig, paths, type, where } = params
    const [dbName, tableName] = paths

    this.database.setConfig({
      client: type,
      username: storeConfig.username,
      password: storeConfig.password,
      host: storeConfig.host,
      port: storeConfig.port,
      dbName,
    })

    const ret = this.database.deleteRow(tableName, where)

    this.database.disconnect()

    return ret
  }
}
