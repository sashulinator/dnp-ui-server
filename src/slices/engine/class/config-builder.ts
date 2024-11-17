import { has, random } from '~/utils/core'
import { toDatabaseUrl } from '~/utils/database/to-database-url'

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
                url: `jdbc:${toDatabaseUrl({
                  client: connection.client,
                  host: connection.host,
                  port: connection.port,
                  database: connection.database,
                  user: connection.username,
                  password: connection.password,
                })}`,
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

  addIn(
    name: string,
    connection:
      | (JdbcConfigByTableConnectionRequired & Partial<JdbcProviderConfigConnection>)
      | (S3ConfigByTableConnectionRequired & Partial<S3ProviderConfigConnection>),
  ) {
    const type = isS3ConfigByTableConnection(connection) ? 's3' : 'jdbc'
    this._providerConfig = {
      ...this._providerConfig,
      [type]: {
        ...this._providerConfig?.[type],
        'config-by-table': {
          ...this._providerConfig?.[type]?.['config-by-table'],
          ...this._buildConfigByTableConnection(name, connection, 'in'),
        },
      },
    }
    return this
  }
  addOut(
    name: string,
    connection:
      | (JdbcConfigByTableConnectionRequired & Partial<JdbcProviderConfigConnection>)
      | (S3ConfigByTableConnectionRequired & Partial<S3ProviderConfigConnection>),
  ) {
    const type = isS3ConfigByTableConnection(connection) ? 's3' : 'jdbc'
    this._providerConfig = {
      ...this._providerConfig,
      [type]: {
        ...this._providerConfig?.[type],
        'config-by-table': {
          ...this._providerConfig?.[type]?.['config-by-table'],
          ...this._buildConfigByTableConnection(name, connection, 'out'),
        },
      },
    }
    return this
  }

  addExecutable(executable: Record<string, unknown>) {
    this._executables.push(executable)

    return this
  }

  private _buildConfigByTableConnection(
    name: string,
    connection:
      | (JdbcConfigByTableConnectionRequired & Partial<JdbcProviderConfigConnection>)
      | (S3ConfigByTableConnectionRequired & Partial<S3ProviderConfigConnection>),
    inputName: 'out' | 'in',
  ) {
    if (isS3ConfigByTableConnection(connection)) {
      return {
        [name]: {
          [`based-on-${inputName}`]: connection.extends,
          [inputName]: {
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
      }
    } else {
      return {
        [name]: {
          [`based-on-${inputName}`]: connection.extends,
          [inputName]: {
            connection: {
              url: connection.client
                ? `jdbc:${toDatabaseUrl({
                    client: connection.client,
                    host: connection.host,
                    port: connection.port,
                    database: connection.database,
                    user: connection.username,
                    password: connection.password,
                  })}`
                : undefined,
              schema: connection.schema,
              truncate: connection.truncate,
              dbtable: connection.table,
            },
          },
        },
      }
    }
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

function isS3ConfigByTableConnection(input: unknown): input is S3ConfigByTableConnectionRequired {
  return has(input, 'fileName')
}
