import { type Knex } from 'knex'

import type { Client } from './interface'

export class PostgresClient implements Client {
  private _knex: Knex

  setKnex(knex: Knex): this {
    this._knex = knex
    return this
  }

  get knex(): Knex {
    if (!this._knex) throw new Error('Knex is not set.')
    return this._knex
  }

  /**
   * Отключить проверку ForeignKey
   * https://www.educative.io/answers/how-to-temporarily-disable-foreign-key-constraints-in-sql
   */
  async disableForeignKeyConstraints() {
    return await this._knex.raw(`
      SET CONSTRAINTS ALL DEFERRED;
    `)
  }

  /**
   * Включить проверку ForeignKey
   * https://www.educative.io/answers/how-to-temporarily-disable-foreign-key-constraints-in-sql
   */
  async enableForeignKeyConstraints() {
    return await this._knex.raw(`
      SET CONSTRAINTS ALL IMMEDIATE;
    `)
  }

  async getPrimaryKey(tableName: string) {
    const ret = await this._knex.raw<{ rows: { attname: string }[] }>(`
        SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type
        FROM   pg_index i
        JOIN   pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE  i.indrelid = '"${tableName}"'::regclass
        AND    i.indisprimary;
    `)

    return ret.rows[0].attname
  }

  async findManyTables(params: {
    limit?: number
    offset?: number
  }): Promise<{ tablename: string; schemaname: string }[]> {
    type Item = { tablename: string; schemaname: string }
    const queryBuilder = this._knex<Item[], Item[]>('pg_tables')
    const ret = await queryBuilder.where('schemaname', '=', 'public').limit(params.limit).offset(params.offset)
    return ret
  }

  async countTables(): Promise<number> {
    type Item = { tablename: string; schemaname: string }
    const queryBuilder = this._knex<Item[], Item[]>('pg_tables')
    const ret = await queryBuilder.where('schemaname', '=', 'public').count('*')
    return parseInt((ret as unknown as { count: string }[])[0].count)
  }

  async findManyAndCountTables(params: {
    limit?: number
    offset?: number
  }): Promise<[{ tablename: string; schemaname: string }[], number]> {
    const findManyPromise = this.findManyTables(params)
    const countPromise = this.countTables()

    return Promise.all([findManyPromise, countPromise])
  }
}
