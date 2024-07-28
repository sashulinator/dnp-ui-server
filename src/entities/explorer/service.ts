import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { type JdbcData } from '~/entities/store-configs/dto'
import { type Explorer } from './dto'

@Injectable()
export default class ExplorerService {
  constructor() {}

  async getJdbcDatabase(jdbcData: JdbcData): Promise<Explorer> {
    type getTablesQueryRet = {
      tablename: string
      schemaname: string
    }

    const url = `postgresql://${jdbcData.username}:${jdbcData.password}@${jdbcData.host}:${jdbcData.port}/${jdbcData.database}?schema=public`

    const prisma = new PrismaClient({ datasources: { db: { url } } })

    const queriedTables: getTablesQueryRet[] =
      await prisma.$queryRaw`SELECT tablename, schemaname FROM pg_tables WHERE schemaname = 'public';`

    const items = queriedTables.map((table) => ({ type: 'table', name: table.tablename, data: {} }) as const)

    prisma.$disconnect()

    return {
      name: jdbcData.database,
      type: 'jdbc',
      items,
    }
  }

  async getJdbcTable(jdbcData: JdbcData, tableName: string): Promise<Explorer> {
    const url = `postgresql://${jdbcData.username}:${jdbcData.password}@${jdbcData.host}:${jdbcData.port}/${jdbcData.database}?schema=public`

    const prismaClient = new PrismaClient({ datasources: { db: { url } } })

    const query = `SELECT * FROM "${tableName}";`

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
