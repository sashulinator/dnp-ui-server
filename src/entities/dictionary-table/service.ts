import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { type Prisma, type DictionaryTable as PrismaDictionaryTable } from '@prisma/client'

import Database, { type Where } from '~/lib/database'
import { type StringFilter } from '~/lib/database/types/where'
import { CrudService } from '~/shared/crud-service'

import PrismaService from '../../shared/prisma/service'
import ExplorerService, {
  type CreateParams,
  type DeleteParams,
  type FindManyParams,
  type UpdateParams,
} from '../explorer/service'
import type { StoreConfig } from '../store-configs/dto'
import { toDatabasConfig } from '../store-configs/lib/to-database-config'
import { assertTableSchema } from './assertions'
import { type TableSchemaItem } from './dto'

export type DictionaryTable = PrismaDictionaryTable
export type CreateDictionaryTable = Prisma.DictionaryTableUncheckedCreateInput
export type UpdateDictionaryTable = Prisma.DictionaryTableUncheckedUpdateInput

export type WhereUniqueInput = Prisma.DictionaryTableWhereUniqueInput
export type WhereInput = Prisma.DictionaryTableWhereInput
export type OrderByWithRelationInput = Prisma.DictionaryTableOrderByWithRelationInput
export type Select = Prisma.DictionaryTableSelect
export type Include = Prisma.DictionaryTableInclude

export type ExplorerFindManyParams = {
  kn: string
  searchQuery: StringFilter
  where: Where
  sort?: Record<string, 'asc' | 'desc'> | undefined
  take: number
  skip: number
}
export type ExplorerFindManyByTableNameParams = { tableName: string; take: number; skip: number }
export type ExplorerCreateParams = { kn: string; input: Record<string, unknown> }
export type ExplorerDeleteParams = { kn: string; where: Where }
export type ExplorerUpdateParams = { kn: string; input: { _id: string } & Record<string, string> }

@Injectable()
export default class DictionaryTableService extends CrudService<
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

  async explorerFindManyAndCountRows(params: ExplorerFindManyParams) {
    const dictionaryTable = await this.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.getStoreConfig()

    assertTableSchema(dictionaryTable.tableSchema)

    const searchOR = params.searchQuery
      ? dictionaryTable.tableSchema.items.reduce<Record<string, StringFilter>[]>((acc, item) => {
          if (item.index) acc.push({ [item.columnName]: params.searchQuery })
          return acc
        }, [])
      : []

    const findManyParams: Required<FindManyParams> = {
      take: params.take || 100,
      skip: params.skip || 0,
      sort: params.sort,
      where: { AND: [{ OR: searchOR }, params.where] },
      type: 'postgres',
      paths: [storeConfig.data.dbName, dictionaryTable.tableName],
      storeConfig: {
        host: storeConfig.data.host,
        port: storeConfig.data.port,
        username: storeConfig.data.username,
        password: storeConfig.data.password,
      },
    }

    const explorer = await this.explorerService.findManyAndCountRows(findManyParams)

    return {
      explorer,
      dictionaryTable,
    }
  }

  async explorerDelete(params: ExplorerDeleteParams) {
    const dictionaryTable = await this.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.getStoreConfig()

    const deleteParams: Required<DeleteParams> = {
      where: params.where,
      type: 'postgres',
      paths: [storeConfig.data.dbName, dictionaryTable.tableName],
      storeConfig: {
        host: storeConfig.data.host,
        port: storeConfig.data.port,
        username: storeConfig.data.username,
        password: storeConfig.data.password,
      },
    }

    const row = await this.explorerService.deleteRow(deleteParams)

    return {
      row,
      dictionaryTable,
    }
  }

  async explorerCreate(params: ExplorerCreateParams) {
    const dictionaryTable = await this.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.getStoreConfig()

    const createParams: Required<CreateParams> = {
      input: params.input,
      type: 'postgres',
      paths: [storeConfig.data.dbName, dictionaryTable.tableName],
      storeConfig: {
        host: storeConfig.data.host,
        port: storeConfig.data.port,
        username: storeConfig.data.username,
        password: storeConfig.data.password,
      },
    }

    const row = await this.explorerService.createRow(createParams)

    return {
      row,
      dictionaryTable,
    }
  }

  async explorerUpdate(params: ExplorerUpdateParams) {
    const dictionaryTable = await this.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.getStoreConfig()

    const updateParams: Required<UpdateParams> = {
      input: params.input,
      where: { _id: params.input._id },
      type: 'postgres',
      paths: [storeConfig.data.dbName, dictionaryTable.tableName],
      storeConfig: {
        host: storeConfig.data.host,
        port: storeConfig.data.port,
        username: storeConfig.data.username,
        password: storeConfig.data.password,
      },
    }

    const row = await this.explorerService.updateRow(updateParams)

    return {
      row,
      dictionaryTable,
    }
  }

  async create(params: { data: CreateDictionaryTable; select?: Select; include?: Include }): Promise<DictionaryTable> {
    const storeConfig = await this.getStoreConfig()

    assertTableSchema(params.data.tableSchema)
    const tableSchema = params.data.tableSchema

    this.database.setConfig(toDatabasConfig(storeConfig))

    return this.prisma.$transaction(async (prismaTrx) => {
      return this.database.transaction(async (databaseTrx) => {
        await databaseTrx.createTable(params.data.tableName, {
          items: [
            { columnName: '_id', type: 'increments' },
            { columnName: '_status', type: 'string', defaultTo: '0' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(tableSchema.items as any),
          ],
        })

        return prismaTrx.dictionaryTable.create(this._prepareSelectIncludeParams(params))
      })
    })
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

    const currentTableSchema = currentDictionaryTable.tableSchema
    assertTableSchema(currentTableSchema, "Невалидные данные в Промежуточной таблице в поле 'tableSchema' в БД")

    const updateTableSchema = params.data.tableSchema
    assertTableSchema(updateTableSchema, "Невалидные данные в Промежуточной таблице в поле 'tableSchema'") // невозможная ошибка

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
          currentDictionaryTable.tableName,
          columnsToDrop.map((item) => item.columnName),
        )
        await databaseTrx.alterTable(currentDictionaryTable.tableName, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: columnsToAdd as any,
        })
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
  }

  /**
   * Получить конфигурацию хранилища
   * Пояснение: в системе для промежуточных таблиц должна быть создана конфигурация хранилица,
   * в которой указаны параметры подключения к базе данных
   * @returns {Promise<StoreConfig>}
   */
  async getStoreConfig(): Promise<StoreConfig> {
    const storeConfig = await this.prisma.storeConfig.findUnique({ where: { kn: 'dictionary-tables' } })

    if (!storeConfig) throw new HttpException('Create StoreConfig with kn="dictionary-tables"', HttpStatus.NOT_FOUND)

    return storeConfig as unknown as StoreConfig
  }
}
