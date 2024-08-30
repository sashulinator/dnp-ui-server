import { type Knex, knex } from 'knex'

import { type Client } from './clients/interface'
import { PostgresClient } from './clients/postgres'
import { alterTable } from './lib/alter-table'
import countRows from './lib/count-rows'
import { type CreateTableSchema, createTable } from './lib/create-table'
import { findManyRows } from './lib/find-many-rows'

export type Config = {
  client: string
  username: string
  password: string
  host: string
  port: string | number
  dbName: string
}

export default class Database {
  private _clientDelegate: Client
  private _knex: Knex

  setConfig(config: Config): this {
    this._knex = knex({
      client: config.client,
      connection: {
        user: config.username,
        password: config.password,
        host: config.host,
        port: Number(config.port),
        database: config.dbName,
      },
    })
    this._clientDelegate = new PostgresClient().setKnex(this._knex)

    return this
  }

  get knex(): Knex {
    if (!this._knex) throw new Error('Knex is not set.')
    return this._knex
  }

  get clientDelegate(): Client {
    if (!this._clientDelegate) throw new Error('ClientHelper is not set.')
    return this._clientDelegate
  }

  /**
   * Для внутреннего использования только! Потребитель ничего не должен нать про knex
   * но без этого метода не получится реализовать транзакции
   */
  _setKnex(knex: Knex): this {
    this._knex = knex
    this._clientDelegate = new PostgresClient().setKnex(this._knex)
    return this
  }

  transaction<T>(cb: (knex: Database) => Promise<T>): Promise<T> {
    return this.knex.transaction((trxKnex) => {
      return cb(new Database()._setKnex(trxKnex))
    })
  }

  /**
   * Database
   */

  disableForeignKeyConstraints() {
    return this.clientDelegate.disableForeignKeyConstraints()
  }

  enableForeignKeyConstraints() {
    return this.clientDelegate.enableForeignKeyConstraints()
  }

  findManyTables(params: { limit?: number; offset?: number }): Promise<{ tablename: string; schemaname: string }[]> {
    return this.clientDelegate.findManyTables(params)
  }

  countTables(): Promise<number> {
    return this.clientDelegate.countTables()
  }

  findManyAndCountTables(params: {
    limit?: number
    offset?: number
  }): Promise<[{ tablename: string; schemaname: string }[], number]> {
    return this.clientDelegate.findManyAndCountTables(params)
  }

  /**
   * Table
   */

  createTable(tableName: string, schema: CreateTableSchema) {
    return createTable(this.knex, tableName, schema)
  }

  alterTable(tableName: string, schema: CreateTableSchema) {
    return alterTable(this.knex, tableName, schema)
  }

  renameTable(tableName: string, newTableName: string) {
    return this.knex.schema.renameTable(tableName, newTableName)
  }

  dropTable(tableName: string) {
    return this.knex.schema.dropTable(tableName)
  }

  dropTableIfExists(tableName: string) {
    return this.knex.schema.dropTableIfExists(tableName)
  }

  getPrimaryKey(tableName: string) {
    return this.clientDelegate.getPrimaryKey(tableName)
  }

  /**
   * Column
   */

  renameColumns(tableName: string, items: { from: string; to: string }[]) {
    return this.knex.schema.alterTable(tableName, (tableBuilder) => {
      items.forEach(({ from, to }) => tableBuilder.renameColumn(from, to))
    })
  }

  dropColumns(tableName: string, names: string[]) {
    return this.knex.schema.alterTable(tableName, (tableBuilder) => {
      names.forEach((name) => tableBuilder.dropColumn(name))
    })
  }

  /**
   * Row
   */

  insertRow(tableName: string, row: Record<string, unknown>) {
    return this.knex(tableName).insert(row)
  }

  deleteRow(tableName: string, where: Record<string, unknown>) {
    return this.knex(tableName).delete().where(where)
  }

  updateRow(tableName: string, row: Record<string, unknown>, where: Record<string, string>) {
    return this.knex(tableName).update(row).where(where)
  }

  // Метод findMany с параметрами limit, offset, where
  async findManyRows(
    tableName: string,
    params: { limit?: number; offset?: number; where?: Record<string, string> | undefined } = {},
  ): Promise<unknown[]> {
    return findManyRows(this.knex, tableName, params)
  }

  // Метод findMany с параметрами limit, offset, where
  async countRows(tableName: string, params: { where?: Record<string, string> } = {}): Promise<number> {
    return countRows(this.knex, tableName, params)
  }

  async findManyAndCountRows(
    tableName: string,
    params: { limit?: number; offset?: number; where?: Record<string, string> | undefined } = {},
  ): Promise<[unknown[], number]> {
    const findManyPromise = this.findManyRows(tableName, params)
    const countPromise = this.countRows(tableName, { where: params.where })
    return Promise.all([findManyPromise, countPromise])
  }
}
