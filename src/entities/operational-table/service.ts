import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { type Prisma, type OperationalTable as PrismaOperationalTable } from '@prisma/client'
import PrismaService from '../../shared/prisma/service'
import ExplorerService, { type ExploreParams as ExplorerExploreParams } from '../explorer/service'
import { CrudService } from '~/shared/crud-service'
import type { StoreConfig } from '../store-configs/dto'
import { TableHelper } from '~/lib/knex'
import { type CreateTableSchemaItem } from '~/lib/knex/table-helper'
import { createFromStoreConfig } from '~/lib/knex'
import { assertTableSchema } from './assertions'

export type OperationalTable = PrismaOperationalTable
export type CreateOperationalTable = Prisma.OperationalTableUncheckedCreateInput
export type UpdateOperationalTable = Prisma.OperationalTableUncheckedUpdateInput

export type WhereUniqueInput = Prisma.OperationalTableWhereUniqueInput
export type WhereInput = Prisma.OperationalTableWhereInput
export type OrderByWithRelationInput = Prisma.OperationalTableOrderByWithRelationInput
export type Select = Prisma.OperationalTableSelect
export type Include = Prisma.OperationalTableInclude

export type ExploreParams = { kn: string; take: number; skip: number }

@Injectable()
export default class OperationalTableService extends CrudService<
  OperationalTable,
  CreateOperationalTable,
  UpdateOperationalTable
> {
  constructor(
    protected prisma: PrismaService,
    private explorerService: ExplorerService
  ) {
    const include: Include = { updatedBy: true, createdBy: true }
    const orderBy: OrderByWithRelationInput = { updatedAt: 'desc' }

    super(
      {
        take: 100,
        orderBy,
        include,
      },
      {
        count: prisma.operationalTable.count.bind(prisma),
        create: prisma.operationalTable.create.bind(prisma),
        update: prisma.operationalTable.update.bind(prisma),
        delete: prisma.operationalTable.delete.bind(prisma),
        getFirst: prisma.operationalTable.findFirstOrThrow.bind(prisma),
        getUnique: prisma.operationalTable.findUniqueOrThrow.bind(prisma),
        findFirst: prisma.operationalTable.findFirst.bind(prisma),
        findMany: prisma.operationalTable.findMany.bind(prisma),
        findUnique: prisma.operationalTable.findUnique.bind(prisma),
        transaction: prisma.$transaction.bind(prisma),
      }
    )
  }

  async explore(params: ExploreParams) {
    const operationlTable = await this.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.getStoreConfig()

    const exploreParams: Required<ExplorerExploreParams> = {
      take: params.take || 100,
      skip: params.skip || 0,
      type: 'jdbc',
      paths: [storeConfig.data.database, operationlTable.tableName],
      storeConfig: {
        host: storeConfig.data.host,
        port: storeConfig.data.port,
        username: storeConfig.data.username,
        password: storeConfig.data.password,
      },
    }

    return this.explorerService.expore(exploreParams)
  }

  /**
   * В системе для промежуточной таблицы должна быть создана конфигурация хранилица,
   * в которой указаны параметры подключения к базе данных
   * @returns {Promise<StoreConfig>}
   */
  async getStoreConfig(): Promise<StoreConfig> {
    const storeConfig = await this.prisma.storeConfig.findUnique({ where: { kn: 'operational-tables' } })

    if (!storeConfig) throw new HttpException('Create StoreConfig with kn="operational-tables"', HttpStatus.NOT_FOUND)

    return storeConfig as unknown as StoreConfig
  }

  async create(params: {
    data: CreateOperationalTable
    select?: Select
    include?: Include
  }): Promise<OperationalTable> {
    const storeConfig = await this.getStoreConfig()

    assertTableSchema(params.data.tableSchema)
    const tableSchema = params.data.tableSchema.items

    const newSchema: CreateTableSchemaItem[] = tableSchema.map((item) => ({
      type: 'string' as const,
      params: [item.name],
    }))

    const knex = createFromStoreConfig(storeConfig.data, storeConfig.data.database)

    return this.prisma.$transaction(async (prismaTrx) => {
      return knex.transaction(async (knexTrx) => {
        const tableHelper = new TableHelper(knexTrx, params.data.tableName)

        await tableHelper.createTable([
          { type: 'increments', params: ['id', { primaryKey: true }] },
          { type: 'string', params: ['_status'], defaultTo: '0' },
          ...newSchema,
        ])

        return prismaTrx.operationalTable.create(this._prepareSelectIncludeParams(params))
      })
    })
  }
}
