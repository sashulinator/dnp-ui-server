import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { type Prisma, type DictionaryTable as PrismaDictionaryTable } from '@prisma/client'

import { _idColumn } from '~/common/entities/operational-table'
import { CrudDelegator } from '~/shared/crud'
import Database from '~/shared/database'
import { SYSNAME } from '~/shared/working-tables/constant/name'

import ExplorerService from '../../shared/explorer/service'
import PrismaService from '../../shared/prisma/service'
import type { StoreConfig } from '../store-configs/dto'
import { toDatabasConfig } from '../store-configs/lib/to-database-config'
import { assertColumns } from './assertions'
import { type Column } from './dto'

export type DictionaryTable = PrismaDictionaryTable
export type CreateDictionaryTable = Prisma.DictionaryTableUncheckedCreateInput
export type UpdateDictionaryTable = Prisma.DictionaryTableUncheckedUpdateInput

export type WhereUniqueInput = Prisma.DictionaryTableWhereUniqueInput
export type WhereInput = Prisma.DictionaryTableWhereInput
export type OrderByWithRelationInput = Prisma.DictionaryTableOrderByWithRelationInput
export type Select = Prisma.DictionaryTableSelect
export type Include = Prisma.DictionaryTableInclude

@Injectable()
export default class DictionaryTableService extends CrudDelegator<
  DictionaryTable,
  CreateDictionaryTable,
  UpdateDictionaryTable
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
        count: prisma.dictionaryTable.count.bind(prisma),
        create: prisma.dictionaryTable.create.bind(prisma),
        update: prisma.dictionaryTable.update.bind(prisma),
        delete: prisma.dictionaryTable.delete.bind(prisma),
        getFirst: prisma.dictionaryTable.findFirstOrThrow.bind(prisma),
        getUnique: prisma.dictionaryTable.findUniqueOrThrow.bind(prisma),
        findFirst: prisma.dictionaryTable.findFirst.bind(prisma),
        findMany: prisma.dictionaryTable.findMany.bind(prisma),
        findUnique: prisma.dictionaryTable.findUnique.bind(prisma),
        transaction: prisma.$transaction.bind(prisma),
      },
    )
  }

  async create(params: { data: CreateDictionaryTable; select?: Select; include?: Include }): Promise<DictionaryTable> {
    const storeConfig = await this.getStoreConfig()

    const tableSchema = params.data
    assertColumns(tableSchema.items)

    this.database.setConfig(toDatabasConfig(storeConfig))

    const ret = await this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        assertColumns(tableSchema.items)
        await databaseTrx.createTable(params.data.tableName, [_idColumn, ...tableSchema.items])
        return prismaTrx.dictionaryTable.create(this._prepareSelectIncludeParams(params))
      })
    })

    this.database.disconnect()

    return ret
  }

  async update(params: {
    data: UpdateDictionaryTable
    select?: Select
    include?: Include
    where: WhereUniqueInput
  }): Promise<DictionaryTable> {
    const currentDictionaryTable = await this.getUnique({ where: params.where })
    const storeConfig = await this.getStoreConfig()

    this.database.setConfig(toDatabasConfig(storeConfig))

    const currentTableSchema = currentDictionaryTable
    assertColumns(currentTableSchema.items, "Невалидные данные в Промежуточной таблице в поле 'tableSchema' в БД")

    const updateTableSchema = params.data
    assertColumns(updateTableSchema.items, "Невалидные данные в Промежуточной таблице в поле 'tableSchema'") // невозможная ошибка

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
      assertColumns(updateTableSchema.items, "Невалидные данные в Промежуточной таблице в поле 'tableSchema'") // невозможная ошибка
      const found = updateTableSchema.items.find((itemToUpdate) => itemToUpdate.id === currentItem.id)
      return !found
    })

    // Если в текущей схеме не находим колонки из новой, то добавим их
    const columnsToAdd: Column[] = updateTableSchema.items.filter((itemToUpdate) => {
      assertColumns(currentTableSchema.items, "Невалидные данные в Промежуточной таблице в поле 'tableSchema'") // невозможная ошибка
      const found = currentTableSchema.items.find((currentItem) => currentItem.id === itemToUpdate.id)
      return !found
    })

    const ret = await this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        await databaseTrx.dropColumns(
          currentDictionaryTable.tableName,
          columnsToDrop.map((item) => item.columnName),
        )
        await databaseTrx.alterTable(currentDictionaryTable.tableName, columnsToAdd)
        await databaseTrx.renameColumns(
          currentDictionaryTable.tableName,
          columnsToRename.map(([currentItem, updateItem]) => ({
            from: currentItem.columnName,
            to: updateItem.columnName,
          })),
        )

        return prismaTrx.dictionaryTable.update(this._prepareSelectIncludeParams(params))
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

    if (!storeConfig)
      throw new HttpException(
        {
          message: `Create StoreConfig with ${SYSNAME}`,
          translated: `Создайте Хранилище с названием "${SYSNAME}"`,
        },
        HttpStatus.NOT_FOUND,
      )

    return storeConfig as unknown as StoreConfig
  }
}
