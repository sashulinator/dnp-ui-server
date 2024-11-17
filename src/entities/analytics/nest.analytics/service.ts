import { Injectable } from '@nestjs/common'
import type { AnalyticalActions } from '@prisma/client'

import type { EngineConfig } from '~/slices/engine'
import { ConfigBuilder, EngineService } from '~/slices/engine'
import { PrismaService } from '~/slices/prisma'
import { generateId } from '~/utils/core'
import { parseDatabaseUrl } from '~/utils/database'

export { type AnalyticalActions }

export type RunParams = {
  services: {
    host: string
    port: number
    username: string
    password: string
    databases: {
      name: string
      schemas: {
        name: string
        tables: {
          name: string
          columns: {
            name: string
            actions: string[]
          }[]
        }[]
      }[]
    }[]
  }[]
}

type EngineConfigs = {
  fileName: string
  bucketName: string
  engineConfig: EngineConfig
}

@Injectable()
export class AnalyticsService {
  constructor(
    protected prisma: PrismaService,
    protected engineService: EngineService,
  ) {}
  run(params: RunParams) {
    const appDatabaseConnection = parseDatabaseUrl(process.env.DATABASE_URL)
    const engineConfigs: EngineConfigs[] = []

    params.services.forEach((service) => {
      service.databases.forEach((database) => {
        database.schemas.forEach((schema) => {
          schema.tables.forEach((table) => {
            const configBulder = new ConfigBuilder()
            const configName = `in_${table.name}`

            const executables = {
              'computable-config': {
                'computable-name': 'dnp-common/artifacts/procedures/DnpTableStats',
                version: '2.0.0',
              },
              'sdk-config': { name: 'risk-engine-corp-sdk', version: '2.0.1-beta' },
              parameters: {
                id: '1',
                table: table.name,
                stats: {},
              },
            }

            table.columns.forEach((column) => {
              executables.parameters.stats[column.name] = column.actions
            })

            configBulder
              .setWriteMode('append')
              .addConnection(configName, {
                client: 'postgresql',
                host: service.host,
                port: service.port,
                username: service.username,
                password: service.password,
                database: database.name,
                schema: schema.name,
              })
              .addConnection('app', {
                client: 'postgresql',
                host: appDatabaseConnection.host,
                port: appDatabaseConnection.port,
                username: appDatabaseConnection.user,
                password: appDatabaseConnection.password,
                database: appDatabaseConnection.database,
                schema: 'public',
                truncate: true,
              })
              .addOut(table.name, {
                table: table.name,
              })
              .addUniversalService('ru.datatech.engine.sdk.service.dataframe.CorpDataFrameServiceFactory')
              .addUniversalService('ru.datatech.engine.sdk.service.configtables.ConfigTablesFactory')
              .addExecutable(executables)

            engineConfigs.push({
              fileName: `${table.name}-table----${generateId()}.json`,
              bucketName: 'test1',
              engineConfig: configBulder.build(),
            })
          })
        })
      })
    })
    return engineConfigs.forEach((config) =>
      this.engineService.runAnalytics({
        fileName: config.fileName,
        bucketName: config.bucketName,
        analyticsConfig: config.engineConfig,
      }),
    )
  }
}
