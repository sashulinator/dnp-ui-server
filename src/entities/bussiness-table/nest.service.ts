import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { type Prisma, type BussinessTable as PrismaBussinessTable } from '@prisma/client'

import { _idColumn } from '~/common/entities/operational-table'
import { CrudDelegator } from '~/slices/crud'
import Database from '~/slices/database'

import ExplorerService from '../../slices/explorer/service'
import PrismaService from '../../slices/prisma/service'
import type { StoreConfig } from '../store-configs/dto'
import { toDatabasConfig } from '../store-configs/lib/to-database-config'
import { assertColumns } from './lib.assertions'
import { type Column } from './models'

export type BussinessTable = PrismaBussinessTable
export type CreateBussinessTable = Prisma.BussinessTableUncheckedCreateInput
export type UpdateBussinessTable = Prisma.BussinessTableUncheckedUpdateInput

export type WhereUniqueInput = Prisma.BussinessTableWhereUniqueInput
export type WhereInput = Prisma.BussinessTableWhereInput
export type OrderByWithRelationInput = Prisma.BussinessTableOrderByWithRelationInput
export type Select = Prisma.BussinessTableSelect
export type Include = Prisma.BussinessTableInclude

@Injectable()
export default class BussinessTableService extends CrudDelegator<
  BussinessTable,
  CreateBussinessTable,
  UpdateBussinessTable
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
        count: prisma.bussinessTable.count.bind(prisma),
        create: prisma.bussinessTable.create.bind(prisma),
        update: prisma.bussinessTable.update.bind(prisma),
        delete: prisma.bussinessTable.delete.bind(prisma),
        getFirst: prisma.bussinessTable.findFirstOrThrow.bind(prisma),
        getUnique: prisma.bussinessTable.findUniqueOrThrow.bind(prisma),
        findFirst: prisma.bussinessTable.findFirst.bind(prisma),
        findMany: prisma.bussinessTable.findMany.bind(prisma),
        findUnique: prisma.bussinessTable.findUnique.bind(prisma),
        transaction: prisma.$transaction.bind(prisma),
      },
    )
  }

  async create(params: { data: CreateBussinessTable; select?: Select; include?: Include }): Promise<BussinessTable> {
    const storeConfig = await this.getStoreConfig()

    const tableSchema = params.data
    assertColumns(tableSchema.columns)

    this.database.setConfig(toDatabasConfig(storeConfig))

    const ret = await this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        assertColumns(tableSchema.columns)
        await databaseTrx.createTable(params.data.name, [_idColumn, ...tableSchema.columns])
        return prismaTrx.bussinessTable.create(this._prepareSelectIncludeParams(params))
      })
    })

    this.database.disconnect()

    return ret
  }

  async update(params: {
    data: UpdateBussinessTable
    select?: Select
    include?: Include
    where: WhereUniqueInput
  }): Promise<BussinessTable> {
    const currentBussinessTable = await this.getUnique({ where: params.where })
    const storeConfig = await this.getStoreConfig()

    this.database.setConfig(toDatabasConfig(storeConfig))

    const currentTableSchema = currentBussinessTable
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
          currentBussinessTable.name,
          columnsToDrop.map((item) => item.name),
        )
        await databaseTrx.alterTable(currentBussinessTable.name, columnsToAdd)
        await databaseTrx.renameColumns(
          currentBussinessTable.name,
          columnsToRename.map(([currentItem, updateItem]) => ({
            from: currentItem.name,
            to: updateItem.name,
          })),
        )

        return prismaTrx.bussinessTable.update(this._prepareSelectIncludeParams(params))
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
