import { type BaseStoreConfig } from '../../src/entities/store-configs/dto'
import { getDatabaseConfigMap } from '../_lib/get-database-config-map'
import { systemUser } from './users'

const databaseConfigMap = getDatabaseConfigMap()

export const rawStoreConfig: BaseStoreConfig = {
  kn: 'RAW_TABLE',
  type: 'postgres',
  createdById: systemUser.id,
  updatedById: systemUser.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  data: {
    username: databaseConfigMap.raw.user,
    password: databaseConfigMap.raw.password,
    host: databaseConfigMap.raw.host,
    port: String(databaseConfigMap.raw.port),
    dbName: databaseConfigMap.raw.database,
  },
}

export const operationalStoreConfig: BaseStoreConfig = {
  kn: 'OPERATIONAL_TABLE',
  type: 'postgres',
  createdById: systemUser.id,
  updatedById: systemUser.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  data: {
    username: databaseConfigMap.operational.user,
    password: databaseConfigMap.operational.password,
    host: databaseConfigMap.operational.host,
    port: String(databaseConfigMap.operational.port),
    dbName: databaseConfigMap.operational.database,
  },
}

export const targetStoreConfig: BaseStoreConfig = {
  kn: 'TARGET_TABLE',
  type: 'postgres',
  createdById: systemUser.id,
  updatedById: systemUser.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  data: {
    username: databaseConfigMap.target.user,
    password: databaseConfigMap.target.password,
    host: databaseConfigMap.target.host,
    port: String(databaseConfigMap.target.port),
    dbName: databaseConfigMap.target.database,
  },
}
