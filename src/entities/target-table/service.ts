import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { type Prisma, type TargetTable as PrismaTargetTable } from '@prisma/client'

import Database from '~/lib/database'
import { Delegator } from '~/shared/crud/lib/delegator'
import { SYSNAME } from '~/shared/working-tables/constant/name'

import ExplorerService from '../../shared/explorer/service'
import PrismaService from '../../shared/prisma/service'
import type { StoreConfig } from '../store-configs/dto'
import { toDatabasConfig } from '../store-configs/lib/to-database-config'
import { assertTableSchema } from './assertions'
import { type TableSchemaItem } from './dto'

export type TargetTable = PrismaTargetTable
export type CreateTargetTable = Prisma.TargetTableUncheckedCreateInput
export type UpdateTargetTable = Prisma.TargetTableUncheckedUpdateInput

export type WhereUniqueInput = Prisma.TargetTableWhereUniqueInput
export type WhereInput = Prisma.TargetTableWhereInput
export type OrderByWithRelationInput = Prisma.TargetTableOrderByWithRelationInput
export type Select = Prisma.TargetTableSelect
export type Include = Prisma.TargetTableInclude

@Injectable()
export default class TargetTableService extends Delegator<TargetTable, CreateTargetTable, UpdateTargetTable> {
  constructor(
    protected prisma: PrismaService,
    private explorerService: ExplorerService,
    private database: Database,
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
        count: prisma.targetTable.count.bind(prisma),
        create: prisma.targetTable.create.bind(prisma),
        update: prisma.targetTable.update.bind(prisma),
        delete: prisma.targetTable.delete.bind(prisma),
        getFirst: prisma.targetTable.findFirstOrThrow.bind(prisma),
        getUnique: prisma.targetTable.findUniqueOrThrow.bind(prisma),
        findFirst: prisma.targetTable.findFirst.bind(prisma),
        findMany: prisma.targetTable.findMany.bind(prisma),
        findUnique: prisma.targetTable.findUnique.bind(prisma),
        transaction: prisma.$transaction.bind(prisma),
      },
    )
  }

  async create(params: { data: CreateTargetTable; select?: Select; include?: Include }): Promise<TargetTable> {
    const storeConfig = await this.getStoreConfig()

    assertTableSchema(params.data.tableSchema)
    const tableSchema = params.data.tableSchema

    this.database.setConfig(toDatabasConfig(storeConfig))

    return this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        await databaseTrx.createTable(params.data.tableName, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: [{ columnName: '_id', type: 'increments' }, ...(tableSchema.items as any[])],
        })
        return prismaTrx.targetTable.create(this._prepareSelectIncludeParams(params))
      })
    })
  }

  async update(params: {
    data: UpdateTargetTable
    select?: Select
    include?: Include
    where: WhereUniqueInput
  }): Promise<TargetTable> {
    const currentTargetTable = await this.getUnique({ where: params.where })
    const storeConfig = await this.getStoreConfig()

    this.database.setConfig(toDatabasConfig(storeConfig))

    const currentTableSchema = currentTargetTable.tableSchema
    assertTableSchema(currentTableSchema, "Невалидные данные в Целевой таблице в поле 'tableSchema' в БД")

    const updateTableSchema = params.data.tableSchema
    assertTableSchema(updateTableSchema, "Невалидные данные в Целевой таблице в поле 'tableSchema'") // невозможная ошибка

    const columnsToRename: [TableSchemaItem, TableSchemaItem][] = []

    for (let ci = 0; ci < updateTableSchema.items.length; ci++) {
      const updateItem = updateTableSchema.items[ci]
      for (let ui = 0; ui < currentTableSchema.items.length; ui++) {
        const currentItem = currentTableSchema.items[ui]
        if (updateItem.id !== currentItem.id) continue
        if (updateItem.columnName !== currentItem.columnName) columnsToRename.push([currentItem, updateItem])
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
      return this.database.transaction(async (databaseTrx) => {
        await databaseTrx.dropColumns(
          currentTargetTable.tableName,
          columnsToDrop.map((item) => item.columnName),
        )
        await databaseTrx.alterTable(currentTargetTable.tableName, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: columnsToAdd as any,
        })
        await databaseTrx.renameColumns(
          currentTargetTable.tableName,
          columnsToRename.map(([currentItem, updateItem]) => ({
            from: currentItem.columnName,
            to: updateItem.columnName,
          })),
        )

        return prismaTrx.targetTable.update(this._prepareSelectIncludeParams(params))
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
    const storeConfig = await this.prisma.storeConfig.findUnique({ where: { kn: SYSNAME } })

    if (!storeConfig) throw new HttpException(`Create StoreConfig with ${SYSNAME}`, HttpStatus.NOT_FOUND)

    return storeConfig as unknown as StoreConfig
  }
}
