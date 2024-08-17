import knex, { type Knex } from 'knex'
import { type StoreConfig } from '~/entities/explorer/dto'

export function createFromStoreConfig<T, K>(
  storeConfig: StoreConfig,
  database: string,
  client: string = 'postgres'
): Knex<T, K> {
  return knex<T, K>({
    client,
    connection: {
      user: storeConfig.username,
      password: storeConfig.password,
      host: storeConfig.host,
      port: parseInt(storeConfig.port),
      database,
    },
  })
}
