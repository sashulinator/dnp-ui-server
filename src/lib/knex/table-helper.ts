import knex, { type Knex } from 'knex'

interface ConnectionConfig {
  host: string
  port: string
  username: string
  password: string
}

export class TableHelper {
  knex: Knex<unknown, unknown[]>

  constructor(
    protected connectionConfig: ConnectionConfig,
    protected database: string,
    protected tableName: string
  ) {
    this.knex = knex({
      client: 'postgres',
      connection: {
        user: connectionConfig.username,
        password: connectionConfig.password,
        port: parseInt(connectionConfig.port),
        host: connectionConfig.host,
        database: database,
      },
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
