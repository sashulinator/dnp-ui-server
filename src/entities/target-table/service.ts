import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { type Prisma, type TargetTable as PrismaTargetTable } from '@prisma/client'

import { _idColumn } from '~/common/entities/operational-table'
import { Delegator } from '~/shared/crud/lib/delegator'
import Database from '~/shared/database'

import ExplorerService from '../../shared/explorer/service'
import PrismaService from '../../shared/prisma/service'
import type { StoreConfig } from '../store-configs/dto'
import { toDatabasConfig } from '../store-configs/lib/to-database-config'
import { assertColumns } from './assertions'
import { type Column } from './dto'

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

    const tableSchema = params.data
    assertColumns(tableSchema.columns)

    this.database.setConfig(toDatabasConfig(storeConfig))

    const ret = await this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        assertColumns(tableSchema.columns)

        await databaseTrx.createTable(params.data.tableName, [_idColumn, ...tableSchema.columns])
        return prismaTrx.targetTable.create(this._prepareSelectIncludeParams(params))
      })
    })

    this.database.disconnect()

    return ret
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

    const currentTableSchema = currentTargetTable
    assertColumns(currentTableSchema.columns, "Невалидные данные в Целевой таблице в поле 'tableSchema' в БД")

    const updateTableSchema = params.data
    assertColumns(updateTableSchema.columns, "Невалидные данные в Целевой таблице в поле 'tableSchema'") // невозможная ошибка

    const columnsToRename: [Column, Column][] = []

    for (let ci = 0; ci < updateTableSchema.columns.length; ci++) {
      const updateItem = updateTableSchema.columns[ci]
      for (let ui = 0; ui < currentTableSchema.columns.length; ui++) {
        const currentItem = currentTableSchema.columns[ui]
        if (updateItem.id !== currentItem.id) continue
        if (updateItem.columnName !== currentItem.columnName) columnsToRename.push([currentItem, updateItem])
      }
    }

    // Если в новой схеме не находим колонки из текущей, то удалим их
    const columnsToDrop: Column[] = currentTableSchema.columns.filter((currentItem) => {
      assertColumns(updateTableSchema.columns, "Невалидные данные в Целевой таблице в поле 'tableSchema'") // невозможная ошибка
      const found = updateTableSchema.columns.find((itemToUpdate) => itemToUpdate.id === currentItem.id)
      return !found
    })

    // Если в текущей схеме не находим колонки из новой, то добавим их
    const columnsToAdd: Column[] = updateTableSchema.columns.filter((itemToUpdate) => {
      assertColumns(currentTableSchema.columns, "Невалидные данные в Целевой таблице в поле 'tableSchema'") // невозможная ошибка
      const found = currentTableSchema.columns.find((currentItem) => currentItem.id === itemToUpdate.id)
      return !found
    })

    const ret = await this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        await databaseTrx.dropColumns(
          currentTargetTable.tableName,
          columnsToDrop.map((item) => item.columnName),
        )
        await databaseTrx.alterTable(currentTargetTable.tableName, columnsToAdd)
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

    this.database.disconnect()

    return ret
  }

  /**
   * Получить конфигурацию хранилища
   * Пояснение: в системе для промежуточных таблиц должна быть создана конфигурация хранилица,
   * в которой указаны параметры подключения к базе данных
   * @returns {Promise<StoreConfig>}
   */
  async getStoreConfig(): Promise<StoreConfig> {
    const storeConfig = await this.prisma.storeConfig.findUnique({ where: { kn: 'TARGET_TABLE' } })

    if (!storeConfig) throw new HttpException(`Create StoreConfig with TARGET_TABLE`, HttpStatus.NOT_FOUND)

    return storeConfig as unknown as StoreConfig
  }
}
