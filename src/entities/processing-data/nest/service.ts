import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/slices/prisma'

export type DatabaseConfig = {
  username: string
  password: string
  host: string
  port: number
  database: string
}

export type GetDatabaseConfigParams = {
  name: string
}

@Injectable()
export class ProcessingDataService {
  constructor(protected prisma: PrismaService) {}

  async getDatabaseConfig(params: GetDatabaseConfigParams): Promise<DatabaseConfig> {
    const databaseIdStore = await this.prisma.store.findFirst({
      where: {
        name: params.name,
      },
    })
    const databaseId = databaseIdStore.data as string
    const database = await this.prisma.dcDatabase.findFirst({
      where: {
        id: databaseId,
      },
      include: {
        Service: true,
      },
    })

    return {
      username: database.Service.username,
      password: database.Service.password,
      host: database.Service.host,
      port: database.Service.port,
      database: database.name,
    }
  }
}
