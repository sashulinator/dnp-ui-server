// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenvVariables = require('dotenv').config().parsed

export const envVariableName = {
  databaseUrl: 'DATABASE_URL',
  externalHost: 'EXTERNAL_HOST',
} as const

export const envVariables = {
  [envVariableName.databaseUrl]: process.env[envVariableName.databaseUrl],
  [envVariableName.externalHost]: process.env[envVariableName.externalHost],
  ...dotenvVariables,
}

export type EnvVariableName = (typeof envVariableName)[keyof typeof envVariableName]

export function getEnvVariable(name: EnvVariableName) {
  const value = envVariables[name]
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`)
  }
  return envVariables[name]
}
