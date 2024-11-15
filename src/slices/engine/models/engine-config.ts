export type WriteMode = 'overwrite' | 'append'

export type S3ProviderConfigConnection = {
  bucket: string
  'dataset-path': string
  format: string
  options: {
    header: boolean
    delimiter: string
  }
}

export type S3ConfigByTableConnection = Partial<S3ProviderConfigConnection> & {
  'dataset-name'?: string
}

export type JdbcProviderConfigConnection = {
  url: string
  schema?: string
  truncate?: boolean // тут была строка 'true', надеюсь boolen тоже принимает
}

export type JdbcConfigByTableConnection = Partial<JdbcProviderConfigConnection> & {
  dbtable: string
}

export type ProviderConfig<TName extends string = string> = {
  connections: {
    [name in TName]: {
      connection: S3ProviderConfigConnection | JdbcProviderConfigConnection
    }
  }
  'config-by-table'?: {
    [name: string]: {
      'based-on-in'?: TName
      'based-on-out'?: TName
      in?: { connection: JdbcConfigByTableConnection | S3ConfigByTableConnection }
      out?: { connection: JdbcConfigByTableConnection | S3ConfigByTableConnection }
    }
  }
}

type Sdk = {
  'storage-provider': 'mixed'
  'write-mode': WriteMode
  'provider-config': Record<string, ProviderConfig>

  dnp: {
    'main-contour': 'TEST'
    contour: 'TEST'
    format: 'dd.MM.yyyy'
    'report-dt': '01.01.1991'
    'config-tables-path': 's3a://dnp-case-4/configtables'
    'config-tables-max-size': 300
  }

  'universal-services': string[]
}

export type EngineConfig = {
  sdk: Sdk

  executables?: Record<string, unknown>[]

  'calc-id'?: number

  // СТАТИКА

  'preload-jars': [
    {
      name: 'dnp-common/artifacts/functions/DnpFunctions'
      version: '0.0.1'
    },
  ]

  'driver-universal-services': ['ru.datatech.functions.DnpStringFunctions', 'ru.datatech.functions.DnpTaxFunctions']

  spark: {
    'app.name': 'dnp-demo-dev'
  }
}
