// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseDbUrl = require('parse-database-url')

export type DatabaseConfig = {
  user: string
  password: string
  database: string
  host: string
  port: number
}

export function parseDatabaseUrl(url: string): DatabaseConfig {
  return parseDbUrl(url)
}
