import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import type { Explorer, StoreConfig } from './dto'

export interface ExploreParams {
  type: 'jdbc'
  paths: string[]
  storeConfig: StoreConfig
}

@Injectable()
export default class ExplorerService {
  constructor() {}

  async expore(params: ExploreParams): Promise<Explorer> {
    const { paths, type, storeConfig } = params
    const [path1, path2] = paths

    if (type === 'jdbc') {
      if (path2) return this.getJdbcTable(storeConfig, path1, path2)

      return this.getJdbcDatabase(storeConfig, path1)
    }
  }

  async getJdbcDatabase(storeConfig: StoreConfig, database: string): Promise<Explorer> {
    type getTablesQueryRet = {
      tablename: string
      schemaname: string
    }

    const url = `postgresql://${storeConfig.username}:${storeConfig.password}@${storeConfig.host}:${storeConfig.port}/${database}?schema=public`

    const prisma = new PrismaClient({ datasources: { db: { url } } })

    const queriedTables: getTablesQueryRet[] =
      await prisma.$queryRaw`SELECT tablename, schemaname FROM pg_tables WHERE schemaname = 'public' LIMIT 100;`

    const items = queriedTables.map((table) => ({ type: 'table', name: table.tablename, data: {} }) as const)

    prisma.$disconnect()

    return {
      paths: [{ name: database, type: 'jdbc' }],
      name: database,
      type: 'jdbc',
      items,
    }
  }

  async getJdbcTable(storeConfig: StoreConfig, database: string, tableName: string): Promise<Explorer> {
    const url = `postgresql://${storeConfig.username}:${storeConfig.password}@${storeConfig.host}:${storeConfig.port}/${database}?schema=public`

    const prismaClient = new PrismaClient({ datasources: { db: { url } } })

    const query = `SELECT * FROM "${tableName}" LIMIT 100;`

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
