import { type Knex } from 'knex'

export class PostgresHelper {
  constructor(protected knex: Knex) {}

  async getPrimaryKey(tableName: string) {
    const ret = await this.knex.raw<{ rows: { attname: string }[] }>(`
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
    const queryBuilder = this.knex<Item[], Item[]>('pg_tables')
    const ret = await queryBuilder.where('schemaname', '=', 'public').limit(params.limit).offset(params.offset)
    return ret
  }

  async countTables(): Promise<number> {
    type Item = { tablename: string; schemaname: string }
    const queryBuilder = this.knex<Item[], Item[]>('pg_tables')
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
