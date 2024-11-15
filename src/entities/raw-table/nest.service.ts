import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { type Prisma, type RawTable as PrismaRawTable } from '@prisma/client'

import { _idColumn } from '~/common/entities/operational-table'
import { CrudDelegator } from '~/slices/crud'
import Database from '~/slices/database'
import { PrismaService } from '~/slices/prisma'

import ExplorerService from '../../slices/explorer/service'
import type { StoreConfig } from '../store-configs/dto'
import { toDatabasConfig } from '../store-configs/lib/to-database-config'
import { assertColumns } from './lib.assertions'
import { type Column } from './models'

export type RawTable = PrismaRawTable
export type CreateRawTable = Prisma.RawTableUncheckedCreateInput
export type UpdateRawTable = Prisma.RawTableUncheckedUpdateInput

export type WhereUniqueInput = Prisma.RawTableWhereUniqueInput
export type WhereInput = Prisma.RawTableWhereInput
export type OrderByWithRelationInput = Prisma.RawTableOrderByWithRelationInput
export type Select = Prisma.RawTableSelect
export type Include = Prisma.RawTableInclude

@Injectable()
export default class RawTableService extends CrudDelegator<RawTable, CreateRawTable, UpdateRawTable> {
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
        count: prisma.rawTable.count.bind(prisma),
        create: prisma.rawTable.create.bind(prisma),
        update: prisma.rawTable.update.bind(prisma),
        delete: prisma.rawTable.delete.bind(prisma),
        getFirst: prisma.rawTable.findFirstOrThrow.bind(prisma),
        getUnique: prisma.rawTable.findUniqueOrThrow.bind(prisma),
        findFirst: prisma.rawTable.findFirst.bind(prisma),
        findMany: prisma.rawTable.findMany.bind(prisma),
        findUnique: prisma.rawTable.findUnique.bind(prisma),
        transaction: prisma.$transaction.bind(prisma),
      },
    )
  }

  async create(params: { data: CreateRawTable; select?: Select; include?: Include }): Promise<RawTable> {
    const storeConfig = await this.getStoreConfig()

    const tableSchema = params.data
    assertColumns(tableSchema.columns)

    this.database.setConfig(toDatabasConfig(storeConfig))

    const ret = await this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        assertColumns(tableSchema.columns)
        await databaseTrx.createTable(params.data.name, [_idColumn, ...tableSchema.columns])
        return prismaTrx.rawTable.create(this._prepareSelectIncludeParams(params))
      })
    })

    this.database.disconnect()

    return ret
  }

  async update(params: {
    data: UpdateRawTable
    select?: Select
    include?: Include
    where: WhereUniqueInput
  }): Promise<RawTable> {
    const currentRawTable = await this.getUnique({ where: params.where })
    const storeConfig = await this.getStoreConfig()

    this.database.setConfig(toDatabasConfig(storeConfig))

    const currentTableSchema = currentRawTable
    assertColumns(currentTableSchema.columns, "Невалидные данные в Промежуточной таблице в поле 'tableSchema' в БД")

    const updateTableSchema = params.data
    assertColumns(updateTableSchema.columns, "Невалидные данные в Промежуточной таблице в поле 'tableSchema'") // невозможная ошибка

    const columnsToRename: [Column, Column][] = []

    for (let ci = 0; ci < updateTableSchema.columns.length; ci++) {
      const updateItem = updateTableSchema.columns[ci]
      for (let ui = 0; ui < currentTableSchema.columns.length; ui++) {
        const currentItem = currentTableSchema.columns[ui]
        if (updateItem.id !== currentItem.id) continue
        if (updateItem.name !== currentItem.name) columnsToRename.push([currentItem, updateItem])
      }
    }

    // Если в новой схеме не находим колонки из текущей, то удалим их
    const columnsToDrop: Column[] = currentTableSchema.columns.filter((currentItem) => {
      assertColumns(updateTableSchema.columns, "Невалидные данные в Промежуточной таблице в поле 'tableSchema'") // невозможная ошибка
      const found = updateTableSchema.columns.find((itemToUpdate) => itemToUpdate.id === currentItem.id)
      return !found
    })

    // Если в текущей схеме не находим колонки из новой, то добавим их
    const columnsToAdd: Column[] = updateTableSchema.columns.filter((itemToUpdate) => {
      assertColumns(currentTableSchema.columns, "Невалидные данные в Промежуточной таблице в поле 'tableSchema'") // невозможная ошибка
      const found = currentTableSchema.columns.find((currentItem) => currentItem.id === itemToUpdate.id)
      return !found
    })

    const ret = await this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        await databaseTrx.dropColumns(
          currentRawTable.name,
          columnsToDrop.map((item) => item.name),
        )
        await databaseTrx.alterTable(currentRawTable.name, columnsToAdd)
        await databaseTrx.renameColumns(
          currentRawTable.name,
          columnsToRename.map(([currentItem, updateItem]) => ({
            from: currentItem.name,
            to: updateItem.name,
          })),
        )

        return prismaTrx.rawTable.update(this._prepareSelectIncludeParams(params))
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
    const storeConfig = await this.prisma.storeConfig.findUnique({ where: { kn: 'RAW_TABLE' } })

    if (!storeConfig)
      throw new HttpException(
        {
          message: `Create StoreConfig with RAW_TABLE`,
          translated: `Создайте Хранилище с названием "RAW_TABLE"`,
        },
        HttpStatus.NOT_FOUND,
      )

    return storeConfig as unknown as StoreConfig
  }
}
