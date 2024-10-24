// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenvVariables = require('dotenv').config().parsed

export const envVariableName = {
  databaseUrl: 'DATABASE_URL',
  operationalDatabaseUrl: 'OPERATIONAL_DATABASE_URL',
  targetDatabaseUrl: 'TARGET_DATABASE_URL',
} as const

export const envVariables = {
  [envVariableName.databaseUrl]: process.env[envVariableName.databaseUrl],
  [envVariableName.operationalDatabaseUrl]: process.env[envVariableName.operationalDatabaseUrl],
  [envVariableName.targetDatabaseUrl]: process.env[envVariableName.targetDatabaseUrl],
  ...dotenvVariables,
}

export type EnvVariableName = (typeof envVariableName)[keyof typeof envVariableName]
