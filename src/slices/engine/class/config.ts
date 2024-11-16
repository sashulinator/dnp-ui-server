export type WriteMode = 'overwrite' | 'append'

export type JdbcProviderConfigConnection = {
  host: string
  port: number
  client: 'postgresql'
  database: string
  username: string
  password: string
  schema: string
  truncate?: boolean
}

export type JdbcConfigByTableConnectionRequired = {
  table: string
  extends?: string
}

export type S3ProviderConfigConnection = {
  bucket: string
  path: string
  format: string
  options?: {
    header: boolean
    delimiter: string
  }
}

export type S3ConfigByTableConnectionRequired = {
  fileName: string
  extends?: string
}
