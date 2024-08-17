import { Injectable } from '@nestjs/common'
import type { Explorer, StoreConfig } from './dto'
import { TableHelper, PostgresHelper } from '~/lib/knex'

export interface ExploreParams {
  type: 'jdbc'
  paths: string[]
  take?: number | undefined
  skip?: number | undefined
  storeConfig: StoreConfig
}

@Injectable()
export default class ExplorerService {
  constructor() {}

  async expore(params: ExploreParams): Promise<Explorer> {
    if (params.type === 'jdbc') {
      if (params.paths.length === 1) return this.getPostgresDatabase(params)
      return this.getPostgresTable(params)
    }
  }

  async getPostgresDatabase(params: ExploreParams): Promise<Explorer> {
    const { storeConfig, paths, take = 100, skip = 0 } = params
    const [database] = paths

    const postgresHelper = new PostgresHelper(storeConfig, database)

    const [queriedTables, count] = await postgresHelper.findManyAndCountTables({ limit: take, offset: skip })

    const items = queriedTables.map((table) => ({ type: 'table', name: table.tablename, data: {} }) as const)

    return {
      paths: [{ name: database, type: 'jdbc' }],
      name: database,
      type: 'jdbc',
      items,
      total: count,
    }
  }

  async getPostgresTable(params: ExploreParams): Promise<Explorer> {
    const { storeConfig, paths } = params
    const [database, tableName] = paths

    const postgresHelper = new PostgresHelper(storeConfig, database)
    const tableCrud = new TableHelper(storeConfig, database, tableName)

    const [rows, count] = await tableCrud.findManyAndCount({ limit: params.take, offset: params.skip })
    const pk = await postgresHelper.getPrimaryKey(tableName)

    const items = rows.map(
      (record) =>
        ({
          type: 'record',
          name: record[pk],
          data: record,
        }) as const
    )

    return {
      paths: [
        { name: database, type: 'jdbc' },
        { name: tableName, type: 'table' },
      ],
      name: tableName,
      type: 'table',
      items,
      total: count,
    }
  }
}
