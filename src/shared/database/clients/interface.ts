import { type Knex } from 'knex'

export interface Client {
  setKnex: (knex: Knex) => void

  disableForeignKeyConstraints: () => Promise<void>

  enableForeignKeyConstraints: () => Promise<void>

  getPrimaryKey: (tableName: string) => Promise<string>

  findManyTables: (params: { limit?: number; offset?: number }) => Promise<{ tablename: string; schemaname: string }[]>

  countTables: () => Promise<number>

  findManyAndCountTables: (params: {
    limit?: number
    offset?: number
  }) => Promise<[{ tablename: string; schemaname: string }[], number]>
}
