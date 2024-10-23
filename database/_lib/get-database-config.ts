// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseDbUrl = require('parse-database-url')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenvVariables = require('dotenv').config().parsed

const envVariableName = {
  databaseUrl: 'DATABASE_URL',
  operationalDatabaseUrl: 'OPERATIONAL_DATABASE_URL',
  targetDatabaseUrl: 'TARGET_DATABASE_URL',
} as const

const envVariables = {
  [envVariableName.databaseUrl]: process.env[envVariableName.databaseUrl],
  [envVariableName.operationalDatabaseUrl]: process.env[envVariableName.operationalDatabaseUrl],
  [envVariableName.targetDatabaseUrl]: process.env[envVariableName.targetDatabaseUrl],
  ...dotenvVariables,
}

export type EnvVariableName = (typeof envVariableName)[keyof typeof envVariableName]

type DatabaseConfig = {
  user: string
  password: string
  database: string
  host: string
  port: number
}

export function getDatabaseConfig(): DatabaseConfig {
  if (!envVariables[envVariableName.databaseUrl]) {
    throw new Error(`Environment variable '${envVariableName.databaseUrl}' does not exist.`)
  }
  return parseDbUrl(envVariables[envVariableName.databaseUrl]) as DatabaseConfig
}

export function getOperationalDatabaseConfig(): DatabaseConfig {
  if (!envVariables[envVariableName.operationalDatabaseUrl]) {
    throw new Error(`Environment variable '${envVariableName.operationalDatabaseUrl}' does not exist.`)
  }
  return parseDbUrl(envVariables[envVariableName.operationalDatabaseUrl]) as DatabaseConfig
}

export function getTargetDatabaseConfig(): DatabaseConfig {
  if (!envVariables[envVariableName.targetDatabaseUrl]) {
    throw new Error(`Environment variable '${envVariableName.targetDatabaseUrl}' does not exist.`)
  }
  return parseDbUrl(envVariables[envVariableName.targetDatabaseUrl]) as DatabaseConfig
}
