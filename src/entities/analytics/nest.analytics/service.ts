import { Injectable } from '@nestjs/common'
import type { AnalyticalActions } from '@prisma/client'

import knex from 'knex'
import { type Knex } from 'knex'

import { type Sort, type Where } from '~/slices/database'
import { buildWhereClause } from '~/slices/database/class.database/lib/build-where-clause'
import { EngineService, type RunNormalizeParams } from '~/slices/engine'
import { PrismaService } from '~/slices/prisma'
import { generateId } from '~/utils/core'
import { parseDatabaseUrl } from '~/utils/database'

import { createAnalyticsConfig } from './lib/create-analytical-config'

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

export type FindManyAndCountTablesParams = {
  take?: number | undefined
  skip?: number | undefined
  where?: Where | undefined
  sort?: Record<string, 'asc' | 'desc'> | undefined
}

@Injectable()
export class AnalyticsService {
  constructor(
    protected prisma: PrismaService,
    protected engineService: EngineService,
  ) {}

  run(params: RunParams) {
    const appDatabaseConnection = parseDatabaseUrl(process.env.DATABASE_URL)
    const runAnaliticsParams: RunNormalizeParams[] = []

    params.services.forEach((service) => {
      service.databases.forEach((database) => {
        database.schemas.forEach((schema) => {
          schema.tables.forEach((table) => {
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

            runAnaliticsParams.push({
              configFileName: `tableName=${table.name}&date=${generateId()}.json`,
              config: createAnalyticsConfig({
                tableName: table.name,
                schemaName: schema.name,
                executableStats: executables.parameters.stats,
                host: appDatabaseConnection.host,
                port: appDatabaseConnection.port,
                user: appDatabaseConnection.user,
                password: appDatabaseConnection.password,
                database: appDatabaseConnection.database,
                client: 'postgresql',
              }),
              type: 'analytics',
            })
          })
        })
      })
    })

    runAnaliticsParams.forEach((params) => this.engineService.runNormalization(params))

    return runAnaliticsParams
  }

  async findManyAndCountTables(params?: FindManyAndCountTablesParams) {
    const connection = parseDatabaseUrl(process.env.DATABASE_URL)

    const kx = knex({
      client: 'pg',
      connection: {
        host: connection.host,
        port: connection.port,
        user: connection.user,
        password: connection.password,
        database: connection.database,
      },
    })
    const queryBuilder = kx.queryBuilder()

    queryBuilder.withSchema('databaseContainer')
    queryBuilder.table('Table')

    const countQueryBuilder = queryBuilder.clone()
    buildWhereClause(queryBuilder, params?.where)
    const count = await countQueryBuilder.count('*').first()

    findManyRows(queryBuilder, params)
    queryBuilder.select(
      'Table.id',
      'Schema.id as schemaId',
      'Schema.name as schemaName',
      'Schema.display as schemaDisplay',
      'Database.id as databaseId',
      'Database.name as databaseName',
      'Database.display as databaseDisplay',
      'Service.id as serviceId',
      'Service.display as serviceDisplay',
    )
    queryBuilder.join('Schema', 'Schema.id', '=', 'Table.schemaId')
    queryBuilder.join('Database', 'Database.id', '=', 'Schema.databaseId')
    queryBuilder.join('Service', 'Service.id', '=', 'Database.serviceId')

    const items = await queryBuilder

    return {
      total: Number(count.count),
      items,
    }
  }
}

/**
 * FIND MANY ROWS
 */

export type FindManyRowsParams = {
  limit?: number | undefined
  offset?: number | undefined
  where?: Where | undefined
  sort?: Sort | undefined
}

// Метод findMany с параметрами limit, offset, where
export function findManyRows(queryBuilder: Knex.QueryBuilder, params: FindManyRowsParams = {}): Knex.QueryBuilder {
  const { limit, offset, where, sort } = params

  if (limit) {
    queryBuilder.limit(limit)
  }
  if (offset) {
    queryBuilder.offset(offset)
  }
  if (where) {
    // Преобразуем объект where в условия knex
    queryBuilder = buildWhereClause(queryBuilder, where)
  }
  if (sort) {
    Object.entries(sort).forEach(([columnName, order]) => {
      queryBuilder = queryBuilder.orderBy(columnName, order)
    })
  }

  return queryBuilder
}
