import { type Config } from '~/lib/database'
import { type StoreConfig } from '../dto'

export function toDatabasConfig(storeConfig: StoreConfig): Config {
  return {
    client: storeConfig.type,
    host: storeConfig.data.host,
    port: storeConfig.data.port,
    username: storeConfig.data.username,
    password: storeConfig.data.password,
    dbName: storeConfig.data.dbName,
  }
}
