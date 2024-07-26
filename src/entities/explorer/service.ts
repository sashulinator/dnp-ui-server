import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import StoreConfigService from '../store-configs/service'

import { assertJDBCData } from '~/common/store-config'

@Injectable()
export class Service {
  constructor(private storeConfigService: StoreConfigService) {}

  async getTables(params: { storeConfigKeyname: string }) {
    const storeConfigPrisma = await this.storeConfigService.findFirst({
      where: {
        keyname: params.storeConfigKeyname,
      },
    })

    const jdbcData = storeConfigPrisma.data

    assertJDBCData(jdbcData)

    const url = `postgresql://${jdbcData.username}:${jdbcData.password}@${jdbcData.host}:${jdbcData.port}/${jdbcData.database}?schema=public`

    const prisma = new PrismaClient({ datasources: { db: { url } } })

    const ret = prisma.$queryRaw`SELECT tablename, schemaname FROM pg_tables WHERE schemaname = 'public';`

    prisma.$disconnect()

    return ret
  }

  async getTable(params: { storeConfigKeyname: string; tableName: string }) {
    const storeConfigPrisma = await this.storeConfigService.findFirst({
      where: {
        keyname: params.storeConfigKeyname,
      },
    })

    const jdbcData = storeConfigPrisma.data

    assertJDBCData(jdbcData)

    const url = `postgresql://${jdbcData.username}:${jdbcData.password}@${jdbcData.host}:${jdbcData.port}/${jdbcData.database}?schema=public`

    return url
  }
}
