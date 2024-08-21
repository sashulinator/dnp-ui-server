import { Injectable } from '@nestjs/common'
import type { Explorer, StoreConfig } from './dto'
import { TableHelper, PostgresHelper, createFromStoreConfig } from '~/lib/knex'
import { has, isString } from '~/utils/core'

export interface UpdateParams {
  paths: string[]
  type: 'postgres'
  storeConfig: StoreConfig
  input: unknown
}

export interface CreateParams {
  paths: string[]
  type: 'postgres'
  storeConfig: StoreConfig
  input: unknown
}

export interface FindManyParams {
  type: 'postgres'
  paths: string[]
  take?: number | undefined
  skip?: number | undefined
  storeConfig: StoreConfig
}

@Injectable()
export default class ExplorerService {
  constructor() {}

  async findMany(params: FindManyParams): Promise<Explorer> {
    if (params.type === 'postgres') {
      if (params.paths.length === 1) return this.findManyPostgresTables(params)
      return this.findManyPostgresRows(params)
    }
  }

  async findManyPostgresTables(params: FindManyParams): Promise<Explorer> {
    const { storeConfig, paths, take = 100, skip = 0 } = params
    const [dbName] = paths

    const postgresHelper = new PostgresHelper(createFromStoreConfig(storeConfig, dbName))

    const [tables, count] = await postgresHelper.findManyAndCountTables({ limit: take, offset: skip })

    return {
      paths: [{ name: dbName, type: 'postgres' }],
      type: 'postgres',
      name: dbName,
      total: count,
      items: tables.map((table) => ({ type: 'table', name: table.tablename, data: {} })),
    }
  }

  async findManyPostgresRows(params: FindManyParams): Promise<Explorer> {
    const { storeConfig, paths } = params
    const [dbName, tableName] = paths

    const knex = createFromStoreConfig(storeConfig, dbName)
    const postgresHelper = new PostgresHelper(knex)
    const tableCrud = new TableHelper(knex, tableName)

    const [rows, count] = await tableCrud.findManyAndCount({ limit: params.take, offset: params.skip })
    const pk = await postgresHelper.getPrimaryKey(tableName)

    return {
      paths: [
        { name: dbName, type: 'postgres' },
        { name: tableName, type: 'table' },
      ],
      name: tableName,
      type: 'table',
      total: count,
      items: rows.map((row) => ({
        type: 'row',
        name: row[pk],
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
    const { storeConfig, paths, input } = params
    const [dbName, tableName] = paths

    const postgresHelper = new TableHelper(createFromStoreConfig(storeConfig, dbName), tableName)
    return postgresHelper.createRow(input as Record<string, unknown>)
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
    const { storeConfig, paths, input } = params
    const [dbName, tableName] = paths

    if (!has(input, 'name') || !isString(input.name)) throw Error('Невалидные данные для внесения изменений')

    const postgresHelper = new TableHelper(createFromStoreConfig(storeConfig, dbName), tableName)
    return postgresHelper.renameTable(input.name)
  }

  updateRow(params: UpdateParams) {
    const { storeConfig, paths, input } = params
    const [dbName, tableName] = paths

    const postgresHelper = new TableHelper(createFromStoreConfig(storeConfig, dbName), tableName)
    return postgresHelper.updateRow(input as Record<string, unknown>)
  }
}
