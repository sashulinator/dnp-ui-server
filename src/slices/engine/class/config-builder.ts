// @ts-nocheck
import { has, random } from '~/utils/core'

import type * as EngineConfigType from '../models/engine-config'
import type {
  JdbcConfigByTableConnectionRequired,
  JdbcProviderConfigConnection,
  S3ConfigByTableConnectionRequired,
  S3ProviderConfigConnection,
  WriteMode,
} from './config'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const omitEmpty = require('omit-empty')

export class ConfigBuilder {
  protected _providerConfig: Record<'s3' | 'jdbc', EngineConfigType.ProviderConfig> | null
  protected _writeMode: EngineConfigType.WriteMode
  protected _trackId: number
  protected _executables: Record<string, unknown>[]

  constructor() {
    this._writeMode = 'overwrite'
    this._providerConfig = null
    this._executables = []
  }

  setWriteMode(mode: WriteMode) {
    this._writeMode = mode
  }

  /** @deprecated попробуем пока не пользоваться, пользуемся addIn и addOut */
  addConnection(name: string, connection: JdbcProviderConfigConnection | S3ProviderConfigConnection) {
    if (isS3ProviderConfigConnection(connection)) {
      this._providerConfig.s3 = {
        ...this._providerConfig.s3,
        connections: {
          ...this._providerConfig.s3?.connections,
          [name]: {
            connection: {
              bucket: connection.bucket,
              'dataset-path': connection.path,
              format: connection.format,
              options: {
                header: connection.options?.header,
                delimiter: connection.options?.delimiter,
              },
            },
          },
        },
      }
    } else {
      this._providerConfig = {
        ...this._providerConfig,
        jdbc: {
          ...this._providerConfig?.jdbc,
          connections: {
            ...this._providerConfig?.jdbc?.connections,
            [name]: {
              connection: {
                url: `jdbc:${connection.client}://${connection.host}:${connection.port}/${connection.database}?user=${connection.username}&password=${connection.password}`,
                schema: connection.schema,
                truncate: connection.truncate,
              },
            },
          },
        },
      }
    }

    return this
  }

  setTrackId(id?: number) {
    this._trackId = id || random(0, 99999999)
    return this
  }

  addIn<TExtend extends string | never>(
    name: string,
    connection: TExtend extends never
      ? S3ConfigByTableConnectionRequired | JdbcConfigByTableConnectionRequired
      :
          | (JdbcConfigByTableConnectionRequired & Partial<JdbcProviderConfigConnection>)
          | (S3ConfigByTableConnectionRequired & Partial<S3ProviderConfigConnection>),
    extendsConnectionName?: string,
  ) {
    if (isS3ConfigByTableConnection(connection)) {
      this._providerConfig = {
        ...this._providerConfig,
        s3: {
          ...this._providerConfig?.s3,
          'config-by-table': {
            ...this._providerConfig.s3?.['config-by-table'],
            [name]: {
              'based-on-in': extendsConnectionName,
              in: {
                connection: {
                  bucket: connection.bucket,
                  'dataset-name': connection.fileName,
                  'dataset-path': connection.path,
                  format: connection.format,
                  options: {
                    header: connection.options?.header,
                    delimiter: connection.options?.delimiter,
                  },
                },
              },
            },
          },
        },
      }
    } else {
      this._providerConfig = {
        ...this._providerConfig,
        jdbc: {
          ...this._providerConfig?.jdbc,
          'config-by-table': {
            ...this._providerConfig?.jdbc?.['config-by-table'],
            [name]: {
              'based-on-in': extendsConnectionName,
              in: {
                connection: {
                  url: connection.client
                    ? `jdbc:${connection.client}://${connection.host}:${connection.port}/${connection.database}?user=${connection.username}&password=${connection.password}`
                    : undefined,
                  schema: connection.schema,
                  truncate: connection.truncate,
                  dbtable: connection.table,
                },
              },
            },
          },
        },
      }
    }

    return this
  }

  addOut<TExtend extends string | never>(
    name: string,
    connection: TExtend extends never
      ? S3ConfigByTableConnectionRequired | JdbcConfigByTableConnectionRequired
      :
          | (JdbcConfigByTableConnectionRequired & Partial<JdbcProviderConfigConnection>)
          | (S3ConfigByTableConnectionRequired & Partial<S3ProviderConfigConnection>),
    extendsConnectionName?: string,
  ) {
    if (isS3ConfigByTableConnection(connection)) {
      this._providerConfig = {
        ...this._providerConfig,
        s3: {
          ...this._providerConfig?.s3,
          'config-by-table': {
            ...this._providerConfig.s3?.['config-by-table'],
            [name]: {
              'based-on-out': extendsConnectionName,
              out: {
                connection: {
                  bucket: connection.bucket,
                  'dataset-path': connection.path,
                  format: connection.format,
                  options: {
                    header: connection.options?.header,
                    delimiter: connection.options?.delimiter,
                  },
                  'dataset-name': connection.fileName,
                },
              },
            },
          },
        },
      }
    } else {
      this._providerConfig = {
        ...this._providerConfig,
        jdbc: {
          ...this._providerConfig?.jdbc,
          'config-by-table': {
            ...this._providerConfig.jdbc?.['config-by-table'],
            [name]: {
              'based-on-out': extendsConnectionName,
              out: {
                connection: {
                  url: connection.client
                    ? `jdbc:${connection.client}://${connection.host}:${connection.port}/${connection.database}?user=${connection.username}&password=${connection.password}`
                    : undefined,
                  schema: connection.schema,
                  truncate: connection.truncate,
                  dbtable: connection.table,
                },
              },
            },
          },
        },
      }
    }

    return this
  }

  addExecutable(executable: Record<string, unknown>) {
    this._executables.push(executable)

    return this
  }

  build(): EngineConfigType.EngineConfig {
    return omitEmpty({
      executables: this._executables,

      'calc-id': this._trackId,

      sdk: {
        'storage-provider': 'mixed',
        'write-mode': this._writeMode,
        'provider-config': this._providerConfig,

        // СТАТИКА

        dnp: {
          'main-contour': 'TEST',
          contour: 'TEST',
          format: 'dd.MM.yyyy',
          'report-dt': '01.01.1991',
          'config-tables-path': 's3a://dnp-case-4/configtables',
          'config-tables-max-size': 300,
        },
        'universal-services': [
          'ru.datatech.sdk.service.dataframe.DFactory',
          'ru.datatech.sdk.service.configtables.ConfigTablesFactory',
          'ru.datatech.sdk.service.procedure.ProcedureConfigFactory',
        ],
      },

      'preload-jars': [
        {
          name: 'dnp-common/artifacts/functions/DnpFunctions',
          version: '0.0.1',
        },
      ],
      'driver-universal-services': [
        'ru.datatech.functions.DnpStringFunctions',
        'ru.datatech.functions.DnpTaxFunctions',
      ],
      spark: {
        'app.name': 'dnp-demo-dev',
      },
    }) as EngineConfigType.EngineConfig
  }
}

function isS3ProviderConfigConnection(input: unknown): input is S3ProviderConfigConnection {
  return has(input, 'bucket')
}

function isS3ConfigByTableConnection(input: unknown): input is S3ConfigByTableConnection {
  return has(input, 'fileName')
}
