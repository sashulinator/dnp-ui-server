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
import { setPath, walk } from '~/utils/dictionary'

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
  limit?: number | undefined
  offset?: number | undefined
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
            if (!table.columns) return
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

    const map = {
      id: 'Table.id',
      name: 'Table.name',
      display: 'Table.display',
      schemaId: 'Schema.id',
      schemaName: 'Schema.name',
      schemaDisplay: 'Schema.display',
      databaseId: 'Database.id',
      databaseName: 'Database.name',
      databaseDisplay: 'Database.display',
      serviceId: 'Service.id',
      serviceDisplay: 'Service.display',
      serviceHost: 'Service.host',
      servicePort: 'Service.port',
      serviceUsername: 'Service.username',
      servicePassword: 'Service.password',
    }

    let newWhere = {}
    walk(params?.where || {}, ({ path, value, key }) => {
      if (key in map) {
        const pathClone = [...path]
        pathClone.pop()
        newWhere = setPath(newWhere, [...pathClone, map[key]], value)
      }
    })

    const kx = knex({
      client: 'pg',
      connection: {
        host: connection.host,
        port: connection.port,
        user: connection.user,
        password: connection.password,
        database: connection.database,
        pool: {
          idleTimeoutMillis: 1,
          max: 10,
          acquireTimeoutMillis: 10_000,
        },
      },
    })
    const queryBuilder = kx.queryBuilder()

    queryBuilder.withSchema('databaseContainer')
    queryBuilder.table('Table')

    const countQueryBuilder = queryBuilder.clone()
    buildWhereClause(queryBuilder, newWhere)
    const count = await countQueryBuilder.count('*').first()

    findManyRows(queryBuilder, { ...params, where: newWhere })
      .select(
        'Table.id as id',
        'Table.name as name',
        'Table.display as display',
        'Schema.id as schemaId',
        'Schema.name as schemaName',
        'Schema.display as schemaDisplay',
        'Database.id as databaseId',
        'Database.name as databaseName',
        'Database.display as databaseDisplay',
        'Service.id as serviceId',
        'Service.display as serviceDisplay',
        'Service.host as serviceHost',
        'Service.port as servicePort',
        'Service.username as serviceUsername',
        'Service.password as servicePassword',
        kx.raw('json_agg("Column".*) FILTER (WHERE "Column".* IS NOT NULL) AS "columns"'),
      )
      .join('Schema', 'Schema.id', '=', 'Table.schemaId')
      .join('Database', 'Database.id', '=', 'Schema.databaseId')
      .join('Service', 'Service.id', '=', 'Database.serviceId')
      .leftJoin('Column', 'Column.tableId', '=', 'Table.id')
      .groupBy('Table.id')
      .groupBy('Schema.id')
      .groupBy('Database.id')
      .groupBy('Service.id')

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
