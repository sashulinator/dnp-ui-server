import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { type Prisma, type OperationalTable as PrismaOperationalTable } from '@prisma/client'

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
import { toDatabaseBuildColumnProps } from './lib/to-database-build-column-props'

export type OperationalTable = PrismaOperationalTable
export type CreateOperationalTable = Prisma.OperationalTableUncheckedCreateInput
export type UpdateOperationalTable = Prisma.OperationalTableUncheckedUpdateInput

export type WhereUniqueInput = Prisma.OperationalTableWhereUniqueInput
export type WhereInput = Prisma.OperationalTableWhereInput
export type OrderByWithRelationInput = Prisma.OperationalTableOrderByWithRelationInput
export type Select = Prisma.OperationalTableSelect
export type Include = Prisma.OperationalTableInclude

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
export default class OperationalTableService extends CrudService<
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

  async explorerFindManyAndCountRows(params: ExplorerFindManyParams) {
    const operationalTable = await this.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.getStoreConfig()

    assertTableSchema(operationalTable.tableSchema)

    const searchOR = params.searchQuery
      ? operationalTable.tableSchema.items.reduce<Record<string, StringFilter>[]>((acc, item) => {
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
      paths: [storeConfig.data.dbName, operationalTable.tableName],
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
      operationalTable,
    }
  }

  async explorerDelete(params: ExplorerDeleteParams) {
    const operationalTable = await this.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.getStoreConfig()

    const deleteParams: Required<DeleteParams> = {
      where: params.where,
      type: 'postgres',
      paths: [storeConfig.data.dbName, operationalTable.tableName],
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
      operationalTable,
    }
  }

  async explorerCreate(params: ExplorerCreateParams) {
    const operationalTable = await this.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.getStoreConfig()

    const createParams: Required<CreateParams> = {
      input: params.input,
      type: 'postgres',
      paths: [storeConfig.data.dbName, operationalTable.tableName],
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
      operationalTable,
    }
  }

  async explorerUpdate(params: ExplorerUpdateParams) {
    const operationalTable = await this.getUnique({ where: { kn: params.kn } })
    const storeConfig = await this.getStoreConfig()

    const updateParams: Required<UpdateParams> = {
      input: params.input,
      where: { _id: params.input._id },
      type: 'postgres',
      paths: [storeConfig.data.dbName, operationalTable.tableName],
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
      operationalTable,
    }
  }

  async create(params: {
    data: CreateOperationalTable
    select?: Select
    include?: Include
  }): Promise<OperationalTable> {
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
            ...tableSchema.items.map(toDatabaseBuildColumnProps),
          ],
        })

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

    this.database.setConfig(toDatabasConfig(storeConfig))

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
          currentOperationalTable.tableName,
          columnsToDrop.map((item) => item.columnName),
        )
        await databaseTrx.alterTable(currentOperationalTable.tableName, {
          items: columnsToAdd.map(toDatabaseBuildColumnProps),
        })
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
