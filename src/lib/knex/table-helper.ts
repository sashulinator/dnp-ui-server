import { type Knex } from 'knex'

export type CreateTableSchemaItem = {
  type: keyof Knex.TableBuilder
  params: Parameters<Knex.TableBuilder[keyof Knex.TableBuilder]>
  nonNullable?: boolean
  defaultTo?: unknown
}

export class TableHelper {
  constructor(
    protected knex: Knex,
    protected tableName: string
  ) {}

  renameTable(newTableName: string) {
    return this.knex.schema.renameTable(this.tableName, newTableName)
  }

  dropTable() {
    return this.knex.schema.dropTable(this.tableName)
  }

  createRow(row: Record<string, unknown>) {
    return this.knex(this.tableName).insert(row)
  }

  deleteRow(where: Record<string, unknown>) {
    return this.knex(this.tableName).delete().where(where)
  }

  updateRow(row: Record<string, unknown>) {
    return this.knex(this.tableName).update(row).where({ id: row.id })
  }

  createTable(schema: CreateTableSchemaItem[]) {
    return this.knex.schema.createTable(this.tableName, (tableBuilder) => {
      schema.forEach((item) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const column = tableBuilder[item.type](...item.params)

        if (item.nonNullable) {
          column.notNullable()
          if (item.defaultTo !== undefined) column.defaultTo(item.defaultTo)
        }
      })
    })
  }

  addColumns(schema: CreateTableSchemaItem[]) {
    return this.knex.schema.alterTable(this.tableName, (tableBuilder) => {
      schema.forEach((item) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const column = tableBuilder[item.type](...item.params)

        if (item.nonNullable) {
          column.notNullable()
          if (item.defaultTo !== undefined) column.defaultTo(item.defaultTo)
        }
      })
    })
  }

  renameColumns(items: { from: string; to: string }[]) {
    return this.knex.schema.alterTable(this.tableName, (tableBuilder) => {
      items.forEach(({ from, to }) => tableBuilder.renameColumn(from, to))
    })
  }

  dropColumns(names: string[]) {
    return this.knex.schema.alterTable(this.tableName, (tableBuilder) => {
      names.forEach((name) => tableBuilder.dropColumn(name))
    })
  }

  // Метод findMany с параметрами limit, offset, where
  async findMany(params: { limit?: number; offset?: number; where?: Record<string, string> } = {}): Promise<unknown[]> {
    const { limit, offset, where } = params
    const queryBuilder = this.knex(this.tableName)

    // Добавляем ограничения (limit, offset)
    if (limit) {
      queryBuilder.limit(limit)
    }
    if (offset) {
      queryBuilder.offset(offset)
    }

    // Добавляем условие WHERE
    if (where) {
      // Преобразуем объект where в условия knex
      for (const [key, value] of Object.entries(where)) {
        queryBuilder.where(key, value)
      }
    }

    const ret = await queryBuilder

    return ret
  }

  // Метод findMany с параметрами limit, offset, where
  async count(params: { where?: Record<string, string> } = {}): Promise<number> {
    const { where } = params
    const queryBuilder = this.knex<unknown, { count: string }>(this.tableName)

    // Добавляем условие WHERE
    if (where) {
      // Преобразуем объект where в условия knex
      for (const [key, value] of Object.entries(where)) {
        queryBuilder.where(key, value)
      }
    }

    queryBuilder.count('*').first()

    const ret = await queryBuilder

    return parseInt(ret.count)
  }

  async findManyAndCount(
    params: { limit?: number; offset?: number; where?: Record<string, string> } = {}
  ): Promise<[unknown[], number]> {
    const findManyPromise = this.findMany(params)
    const countPromise = this.count({ where: params.where })
    return Promise.all([findManyPromise, countPromise])
  }
}
