export type ParsedDatabaseUrl = {
  user: string
  password: string
  database: string
  host: string
  port: number
  client: string
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseDbUrl = require('parse-database-url')

export function parseDatabaseUrl(url: string): ParsedDatabaseUrl {
  return parseDbUrl(url)
}
