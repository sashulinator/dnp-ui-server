import { getEnvVariable } from 'database/_lib/get-env-variables'

import { parseDatabaseUrl } from '~/utils/database'

import { type BaseStoreConfig } from '../../src/entities/store-configs/dto'
import { systemUser } from './users'

const databaseConfig = parseDatabaseUrl(getEnvVariable('DATABASE_URL'))
const externalHost = getEnvVariable('EXTERNAL_HOST')

export const rawStoreConfig: BaseStoreConfig = {
  kn: 'RAW_TABLE',
  type: 'postgres',
  createdById: systemUser.id,
  updatedById: systemUser.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  data: {
    username: databaseConfig.user,
    password: databaseConfig.password,
    host: externalHost,
    port: String(databaseConfig.port),
    dbName: databaseConfig.database,
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
    username: databaseConfig.user,
    password: databaseConfig.password,
    host: databaseConfig.host,
    port: String(databaseConfig.port),
    dbName: databaseConfig.database,
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
    username: databaseConfig.user,
    password: databaseConfig.password,
    host: databaseConfig.host,
    port: String(databaseConfig.port),
    dbName: databaseConfig.database,
  },
}
