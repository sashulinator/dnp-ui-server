import { Injectable } from '@nestjs/common'
import { type Prisma, type DictionaryTable as PrismaDictionaryTable } from '@prisma/client'

import { _idColumn } from '~/common/entities/operational-table'
import { CrudDelegator } from '~/slices/crud'
import Database from '~/slices/database'
import { PrismaService } from '~/slices/prisma'

import { ProcessingDataService, TARGET_STORE } from '../processing-data'
import { assertColumns } from './lib.assertions'
import { type Column } from './models.dictionary-table'

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
    private processingDataService: ProcessingDataService,
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
    const databaseConfig = await this.processingDataService.getDatabaseConfig({ name: TARGET_STORE })

    const tableSchema = params.data
    assertColumns(tableSchema.columns)

    this.database.setConfig({
      client: 'pg',
      dbName: databaseConfig.database,
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
    })

    const ret = await this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        assertColumns(tableSchema.columns)
        await databaseTrx.createTable(params.data.name, [_idColumn, ...tableSchema.columns])
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
    const databaseConfig = await this.processingDataService.getDatabaseConfig({ name: TARGET_STORE })

    this.database.setConfig({
      client: 'pg',
      dbName: databaseConfig.database,
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
    })

    const currentTableSchema = currentDictionaryTable
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
          currentDictionaryTable.name,
          columnsToDrop.map((item) => item.name),
        )
        await databaseTrx.alterTable(currentDictionaryTable.name, columnsToAdd)
        await databaseTrx.renameColumns(
          currentDictionaryTable.name,
          columnsToRename.map(([currentItem, updateItem]) => ({
            from: currentItem.name,
            to: updateItem.name,
          })),
        )

        return prismaTrx.dictionaryTable.update(this._prepareSelectIncludeParams(params))
      })
    })

    this.database.disconnect()

    return ret
  }
}
