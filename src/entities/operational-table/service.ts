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
import { type TableSchemaItem } from './dto'

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
      params: [item.key],
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

  async update(params: {
    data: UpdateOperationalTable
    select?: Select
    include?: Include
    where: WhereUniqueInput
  }): Promise<OperationalTable> {
    const currentOperationalTable = await this.getUnique({ where: params.where })
    const storeConfig = await this.getStoreConfig()
    const knex = createFromStoreConfig(storeConfig.data, storeConfig.data.database)

    const currentTableSchema = currentOperationalTable.tableSchema
    assertTableSchema(currentTableSchema, "Невалидные данные в Промежуточной таблице в поле 'tableSchema' в БД")

    const updateTableSchema = params.data.tableSchema
    assertTableSchema(updateTableSchema, "Невалидные данные в Промежуточной таблице в поле 'tableSchema'") // невозможная ошибка

    const columnsToRename: [TableSchemaItem, TableSchemaItem][] = []

    for (let ci = 0; ci < updateTableSchema.items.length; ci++) {
      const updateItem = updateTableSchema.items[ci]
      for (let ui = 0; ui < currentTableSchema.items.length; ui++) {
        const currentItem = currentTableSchema.items[ui]
        if (updateItem.id !== currentItem.id) continue
        if (updateItem.key !== currentItem.key) columnsToRename.push([currentItem, updateItem])
      }
    }

    // Если в новой схеме не находим колонки из текущей, то удалим их
    const columnsToDrop: TableSchemaItem[] = currentTableSchema.items.filter((currentItem) => {
      const found = updateTableSchema.items.find((itemToUpdate) => itemToUpdate.id === currentItem.id)
      return !found
    })

    // Если в текущей схеме не находим колонки из новой, то добавим их
    const columnsToAdd: TableSchemaItem[] = updateTableSchema.items.filter((itemToUpdate) => {
      const found = currentTableSchema.items.find((currentItem) => currentItem.id === itemToUpdate.id)
      return !found
    })

    return this.prisma.$transaction(async (prismaTrx) => {
      return knex.transaction(async (knexTrx) => {
        const tableHelper = new TableHelper(knexTrx, currentOperationalTable.tableName)

        await tableHelper.dropColumns(columnsToDrop.map((item) => item.key))
        await tableHelper.addColumns(columnsToAdd.map((item) => ({ type: 'string', params: [item.key] })))
        await tableHelper.renameColumns(
          columnsToRename.map(([currentItem, updateItem]) => ({ from: currentItem.key, to: updateItem.key }))
        )

        return prismaTrx.operationalTable.update(this._prepareSelectIncludeParams(params))
      })
    })
  }

  /**
   * Получить конфигурацию хранилища
   * Пояснение: в системе для промежуточных таблиц должна быть создана конфигурация хранилица,
   * в которой указаны параметры подключения к базе данных
   * @returns {Promise<StoreConfig>}
   */
  async getStoreConfig(): Promise<StoreConfig> {
    const storeConfig = await this.prisma.storeConfig.findUnique({ where: { kn: 'operational-tables' } })

    if (!storeConfig) throw new HttpException('Create StoreConfig with kn="operational-tables"', HttpStatus.NOT_FOUND)

    return storeConfig as unknown as StoreConfig
  }
}
