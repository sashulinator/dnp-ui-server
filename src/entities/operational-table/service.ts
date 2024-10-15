import { Injectable } from '@nestjs/common'
import { type Prisma, type OperationalTable as PrismaOperationalTable } from '@prisma/client'

import { _idColumn, _statusColumn } from '~/common/entities/operational-table'
import { CrudDelegator } from '~/shared/crud'
import Database from '~/shared/database'
import { HttpException, HttpStatus } from '~/shared/error'
import { SYSNAME } from '~/shared/working-tables/constant/name'

import ExplorerService from '../../shared/explorer/service'
import PrismaService from '../../shared/prisma/service'
import type { StoreConfig } from '../store-configs/dto'
import { toDatabasConfig } from '../store-configs/lib/to-database-config'
import { assertColumn } from './assertions'
import { type Column } from './dto'

export type OperationalTable = PrismaOperationalTable
export type CreateOperationalTable = Prisma.OperationalTableUncheckedCreateInput
export type UpdateOperationalTable = Prisma.OperationalTableUncheckedUpdateInput

export type WhereUniqueInput = Prisma.OperationalTableWhereUniqueInput
export type WhereInput = Prisma.OperationalTableWhereInput
export type OrderByWithRelationInput = Prisma.OperationalTableOrderByWithRelationInput
export type Select = Prisma.OperationalTableSelect
export type Include = Prisma.OperationalTableInclude

@Injectable()
export default class OperationalTableService extends CrudDelegator<
  OperationalTable,
  CreateOperationalTable,
  UpdateOperationalTable
> {
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
      },
    )
  }

  async create(params: {
    data: CreateOperationalTable
    select?: Select
    include?: Include
  }): Promise<OperationalTable> {
    const storeConfig = await this.getStoreConfig()

    assertColumn(params.data.items)
    const tableSchema = params.data

    this.database.setConfig(toDatabasConfig(storeConfig))

    const ret = await this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        assertColumn(tableSchema.items)
        await databaseTrx.createTable(params.data.tableName, [_idColumn, _statusColumn, ...tableSchema.items])

        return prismaTrx.operationalTable.create(this._prepareSelectIncludeParams(params))
      })
    })

    this.database.disconnect()

    return ret
  }

  async update(params: {
    data: UpdateOperationalTable
    select?: Select
    include?: Include
    where: WhereUniqueInput
  }): Promise<OperationalTable> {
    const currentOperationalTable = await this.getUnique({ where: params.where })
    const storeConfig = await this.getStoreConfig()

    this.database.setConfig(toDatabasConfig(storeConfig))

    const currentTableSchema = currentOperationalTable
    assertColumn(currentTableSchema.items, "Невалидные данные в Промежуточной таблице в поле 'tableSchema' в БД")

    const updateTableSchema = params.data
    assertColumn(updateTableSchema.items, "Невалидные данные в Промежуточной таблице в поле 'tableSchema'") // невозможная ошибка

    const columnsToRename: [Column, Column][] = []

    for (let ci = 0; ci < updateTableSchema.items.length; ci++) {
      const updateItem = updateTableSchema.items[ci]
      for (let ui = 0; ui < currentTableSchema.items.length; ui++) {
        const currentItem = currentTableSchema.items[ui]
        if (updateItem.id !== currentItem.id) continue
        if (updateItem.columnName !== currentItem.columnName) columnsToRename.push([currentItem, updateItem])
      }
    }

    // Если в новой схеме не находим колонки из текущей, то удалим их
    const columnsToDrop: Column[] = currentTableSchema.items.filter((currentItem) => {
      assertColumn(updateTableSchema.items, "Невалидные данные в Промежуточной таблице в поле 'tableSchema'") // невозможная ошибка
      const found = updateTableSchema.items.find((itemToUpdate) => itemToUpdate.id === currentItem.id)
      return !found
    })

    // Если в текущей схеме не находим колонки из новой, то добавим их
    const columnsToAdd: Column[] = updateTableSchema.items.filter((itemToUpdate) => {
      assertColumn(currentTableSchema.items, "Невалидные данные в Промежуточной таблице в поле 'tableSchema'") // невозможная ошибка
      const found = currentTableSchema.items.find((currentItem) => currentItem.id === itemToUpdate.id)
      return !found
    })

    const ret = await this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        await databaseTrx.dropColumns(
          currentOperationalTable.tableName,
          columnsToDrop.map((item) => item.columnName),
        )
        await databaseTrx.alterTable(currentOperationalTable.tableName, columnsToAdd)
        await databaseTrx.renameColumns(
          currentOperationalTable.tableName,
          columnsToRename.map(([currentItem, updateItem]) => ({
            from: currentItem.columnName,
            to: updateItem.columnName,
          })),
        )

        return prismaTrx.operationalTable.update(this._prepareSelectIncludeParams(params))
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
    const storeConfig = await this.prisma.storeConfig.findUnique({ where: { kn: SYSNAME } })

    if (!storeConfig) {
      throw new HttpException(
        {
          message: `Create StoreConfig with ${SYSNAME}`,
          translated: `Не удалось найти Хранилище "${SYSNAME}"`,
          description: `Создайте Хранилище с названием "${SYSNAME}"`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    return storeConfig as unknown as StoreConfig
  }
}
