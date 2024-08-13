import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import type { Explorer, StoreConfig } from './dto'

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
      if (params.paths.length === 1) return this.getJdbcDatabase(params)

      return this.getJdbcTable(params)
    }
  }

  async getJdbcDatabase(params: ExploreParams): Promise<Explorer> {
    type getTablesQueryRet = {
      tablename: string
      schemaname: string
    }

    const { storeConfig, paths, take = 100, skip = 0 } = params
    const [database] = paths

    const url = `postgresql://${storeConfig.username}:${storeConfig.password}@${storeConfig.host}:${storeConfig.port}/${database}?schema=public`

    const prisma = new PrismaClient({ datasources: { db: { url } } })

    const queriedTables: getTablesQueryRet[] =
      await prisma.$queryRaw`SELECT tablename, schemaname FROM pg_tables WHERE schemaname = 'public' LIMIT ${take} OFFSET ${skip};`

    const items = queriedTables.map((table) => ({ type: 'table', name: table.tablename, data: {} }) as const)

    prisma.$disconnect()

    return {
      paths: [{ name: database, type: 'jdbc' }],
      name: database,
      type: 'jdbc',
      items,
    }
  }

  async getJdbcTable(params: ExploreParams): Promise<Explorer> {
    const { storeConfig, paths, take = 100, skip = 0 } = params
    const [database, tableName] = paths

    const url = `postgresql://${storeConfig.username}:${storeConfig.password}@${storeConfig.host}:${storeConfig.port}/${database}?schema=public`

    const prismaClient = new PrismaClient({ datasources: { db: { url } } })

    const query = `SELECT * FROM "${tableName}" LIMIT ${take} OFFSET ${skip};`

    const queriedRecords: unknown[] = await prismaClient.$queryRawUnsafe(query)

    const [pk] = await this.getPrimaryKeys(prismaClient, tableName)

    const items = queriedRecords.map(
      (record) =>
        ({
          type: 'record',
          name: record[pk.attname],
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
    }
  }

  async getPrimaryKeys(prismaClient: PrismaClient, tableName: string) {
    const pks = (await prismaClient.$queryRawUnsafe(`
        SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type
        FROM   pg_index i
        JOIN   pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE  i.indrelid = '"${tableName}"'::regclass
        AND    i.indisprimary;
    `)) as { attname: string }[]

    return pks
  }
}
