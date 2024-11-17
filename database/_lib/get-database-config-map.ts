import { parseDatabaseUrl } from '~/utils/database'

import { envVariableName, envVariables } from './get-env-variables'

export type DatabaseConfig = {
  user: string
  password: string
  database: string
  host: string
  port: number
}

export type DatabaseConfigMap = {
  app: DatabaseConfig
  operational: DatabaseConfig
  target: DatabaseConfig
  raw: DatabaseConfig
}

export function getAppDatabaseConfig(): DatabaseConfig {
  if (!envVariables[envVariableName.databaseUrl]) {
    throw new Error(`Environment variable '${envVariableName.databaseUrl}' does not exist.`)
  }
  return parseDatabaseUrl(envVariables[envVariableName.databaseUrl]) as DatabaseConfig
}

export function getOperationalDatabaseConfig(): DatabaseConfig {
  if (!envVariables[envVariableName.operationalDatabaseUrl]) {
    throw new Error(`Environment variable '${envVariableName.operationalDatabaseUrl}' does not exist.`)
  }
  return parseDatabaseUrl(envVariables[envVariableName.operationalDatabaseUrl]) as DatabaseConfig
}

export function getTargetDatabaseConfig(): DatabaseConfig {
  if (!envVariables[envVariableName.targetDatabaseUrl]) {
    throw new Error(`Environment variable '${envVariableName.targetDatabaseUrl}' does not exist.`)
  }
  return parseDatabaseUrl(envVariables[envVariableName.targetDatabaseUrl]) as DatabaseConfig
}

export function getRawDatabaseConfig(): DatabaseConfig {
  if (!envVariables[envVariableName.targetDatabaseUrl]) {
    throw new Error(`Environment variable '${envVariableName.targetDatabaseUrl}' does not exist.`)
  }
  return parseDatabaseUrl(envVariables[envVariableName.targetDatabaseUrl]) as DatabaseConfig
}

export function getDatabaseConfigMap(): DatabaseConfigMap {
  return {
    app: getAppDatabaseConfig(),
    operational: getOperationalDatabaseConfig(),
    target: getTargetDatabaseConfig(),
    raw: getRawDatabaseConfig(),
  }
}
